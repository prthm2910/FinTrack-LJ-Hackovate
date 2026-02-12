# /api/v1/endpoints/ai.py

from fastapi import APIRouter, HTTPException, Request
import traceback
from models.schemas import QueryRequest
from services.permissions import get_user_permissions, format_permission_instructions
from services.ai_agent import init_agent
from config.rate_limiter import limiter

router = APIRouter()

@router.post("/ai/chat")
@limiter.limit("4/minute")
async def conversational_ai_chat(query: QueryRequest, request: Request):
    """Conversational AI chat that remembers conversation history and enforces permissions."""
    
    agent_executor = request.app.state.agent_executor
    get_session_history = request.app.state.get_session_history
    
    if not agent_executor or not get_session_history:
        raise HTTPException(status_code=503, detail="AI Agent is not initialized. Check server logs.")
    
    try:
        print(f"🔍 [AI CHAT] Processing request for user: {query.user_id}")
        chat_history = get_session_history(query.user_id)
        permissions = get_user_permissions(query.user_id)
        permission_instructions = format_permission_instructions(permissions)
        
        print(f"📝 [AI CHAT] User Question: {query.question}")
        print(f"🛡️ [AI CHAT] Permissions enforced: {permissions}")

        combined_input = f"""
        IMPORTANT CONTEXT: You are answering for user_id: {query.user_id}
        When querying the database, ALWAYS filter by WHERE user_id = '{query.user_id}' for tables: assets, investments, liabilities, transactions.
        
        {permission_instructions}

        User Question: {query.question}
        """
        
        agent_input = {
            "input": combined_input,
            "chat_history": chat_history.messages,
            "user_id": query.user_id,  # Pass user_id as context
        }
        
        print(f"⚙️ [AI CHAT] Calling LangChain Agent Executor...")
        response = agent_executor.invoke(agent_input)
        final_answer = response.get("output")
        print(f"✨ [AI CHAT] Agent execution complete. Raw output type: {type(final_answer)}")
        
        # Handle cases where final_answer might be a list (common with some Gemini/LangChain versions)
        if isinstance(final_answer, list):
            extracted_text = []
            for item in final_answer:
                if isinstance(item, dict) and 'text' in item:
                    extracted_text.append(item['text'])
                elif isinstance(item, str):
                    extracted_text.append(item)
            final_answer = "\n".join(extracted_text)
        elif not isinstance(final_answer, str):
            # Fallback for any other non-string types
            final_answer = str(final_answer) if final_answer is not None else "I'm sorry, I couldn't generate a response."
        
        chat_history.add_user_message(query.question)
        chat_history.add_ai_message(final_answer)
        
        print(f"✅ [AI CHAT] Successfully returning response to user {query.user_id}")
        return {
            "user_id": query.user_id,
            "question": query.question,
            "answer": final_answer,
            "permissions_enforced": permissions
        }
    except Exception as e:
        error_str = str(e)
        print(f"❌ [AI CHAT] ERROR: {e}")
        print(f"Full traceback: {traceback.format_exc()}")
        
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
            raise HTTPException(
                status_code=429, 
                detail="The AI service (Groq) is currently at its quota limit. Please try again soon."
            )
            
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")

@router.post("/reload-agent")
def reload_agent(http_request: Request):
    """Reload the AI Agent manually without restarting the server."""
    try:
        agent_executor, session_manager = init_agent()
        http_request.app.state.agent_executor = agent_executor
        http_request.app.state.get_session_history = session_manager
        return {"status": "✅ Agent reloaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Failed to reload agent: {e}")

@router.get("/ai/templates")
async def get_ai_templates():
    """Get AI Studio templates."""
    return [
        {"id": "investment-review", "title": "Investment Portfolio Review", "category": "investment", "icon": "show_chart", "description": "Get personalized advice on your investment mix"},
        {"id": "budget-optimizer", "title": "Monthly Budget Optimizer", "category": "budgeting", "icon": "pie_chart", "description": "Optimize your monthly spending"},
        {"id": "spending-analysis", "title": "Spending Pattern Analysis", "category": "budgeting", "icon": "analytics", "description": "Analyze your spending habits"},
        {"id": "debt-payoff", "title": "Debt Payoff Strategy", "category": "loans", "icon": "payments", "description": "Create a debt elimination plan"},
    ]