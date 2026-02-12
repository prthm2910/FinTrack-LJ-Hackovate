# /services/ai_agent.py

import os
import time
from collections import deque
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent
from langchain_classic.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

from config.database import get_engine

# Groq has generous rate limits, so we don't need a custom rate limiter here.

session_histories = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    """Gets the chat history for a given session ID."""
    if session_id not in session_histories:
        session_histories[session_id] = ChatMessageHistory()
    return session_histories[session_id]

def init_agent():
    """Initializes and returns a conversational agent with SQL tools and memory."""
    if "GROQ_API_KEY" not in os.environ or not os.environ["GROQ_API_KEY"]:
        raise ValueError("Error: GROQ_API_KEY environment variable not set or empty.")

    print("Initializing Conversational AI Agent with Groq...")
    
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        groq_api_key=os.environ.get("GROQ_API_KEY")
    )
    db_engine = get_engine()
    db = SQLDatabase(db_engine)

    # Create SQL agent with user-aware prompt
    sql_agent_prefix = """You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct postgresql query to run, then look at the results of the query and return the answer.

CRITICAL SECURITY AND EFFICIENCY RULES:
1. You are answering questions for a SPECIFIC user identified by their user_id.
2. ALWAYS include 'WHERE user_id = '{user_id}'' in your SQL queries for these tables: assets, investments, liabilities, transactions
3. The 'users' table does not need the WHERE filter when you're looking up user information by user_id.
4. NEVER query data from other users. This is a security requirement.
5. If you don't know which user_id to use, you MUST ask for clarification before running any query.

Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most 10 results.
You can order the results by a relevant column to return the most interesting examples in the database.
Never query for all the columns from a specific table, only ask for the relevant columns given the question.
You have access to tools for interacting with the database.
Only use the given tools. Only use the information returned by the tools to construct your final answer.
You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

If the question does not seem related to the database, just return "I don't know" as the answer.
"""
    
    sql_agent_suffix = """Begin!

Question: {input}
Thought: I should look at the tables in the database to see what I can query. Then I should query the schema of the most relevant tables.
{agent_scratchpad}"""

    sql_agent_executor = create_sql_agent(
        llm, 
        db=db, 
        agent_type="openai-tools", 
        verbose=True,
        prefix=sql_agent_prefix,
        suffix=sql_agent_suffix
    )

    financial_database_tool = Tool(
        name="financial_database_tool",
        func=sql_agent_executor.invoke,
        description="""
        Use this tool for any questions about the user's personal financial data.
        It can answer questions about transactions, spending, income, assets, investments, liabilities, credit score, and EPF balance.
        Use it to perform calculations, analysis, and retrieve specific numbers.
        IMPORTANT: This tool automatically filters data to show only the requesting user's information.
        """,
    )
    tools = [financial_database_tool]

    # --- FINAL, MOST FORCEFUL SYSTEM PROMPT ---
    system_prompt = """
    You are FinAI, a specialized financial data analyst. 🤖

    **Your Core Directive:**
    Your primary function is to answer questions by analyzing the user's personal financial data, which you access through a secure tool.

    **CRITICAL RULES OF ENGAGEMENT:**
    1.  **ALWAYS Use the Tool:** For ANY question that is related to the user's personal finances (spending, assets, investments, budgeting, analysis, etc.), your first and only initial action MUST be to use the `financial_database_tool`.
    2.  **NO General Knowledge:** Do not answer financial questions from your general knowledge. Ground all financial answers in the data retrieved from the tool.
    3.  **NO Clarifying Questions First:** Do not ask the user for clarification on a financial question. First, use the tool to retrieve all potentially relevant data. If you still need more information after analyzing the data, you can then ask a question.
    4.  **Handle Out-of-Scope:** If the question is clearly NOT related to personal finance (e.g., "What's the weather?"), you must politely decline and state your purpose. Example: "As FinAI, I can only help with your financial data. How can I assist with that? 📊"
    5.  **Tool Abstraction:** Never mention your tools. Describe your actions naturally (e.g., "I analyzed your spending records...").
    """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_openai_tools_agent(llm, tools, prompt)

    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True
    )

    print("Conversational AI Agent is created with a data-first, forceful prompt.")
    return agent_executor, get_session_history