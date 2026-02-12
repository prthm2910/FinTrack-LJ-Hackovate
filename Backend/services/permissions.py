# /services/permissions.py

import sqlalchemy
from config.database import engine

def get_user_permissions(user_id: str) -> dict:
    """Fetch user permissions from the database."""
    if not engine:
        raise ConnectionError("Database engine is not available.")
    try:
        with engine.connect() as conn:
            result = conn.execute(
                sqlalchemy.text("""
                    SELECT perm_assets, perm_liabilities, perm_transactions, 
                           perm_investments, perm_credit_score, perm_epf_balance
                    FROM Users WHERE user_id = :user_id
                """),
                {"user_id": user_id}
            ).fetchone()
            
            if not result:
                return {p: False for p in ["perm_assets", "perm_liabilities", "perm_transactions", "perm_investments", "perm_credit_score", "perm_epf_balance"]}
            
            return {
                "perm_assets": result[0], "perm_liabilities": result[1], "perm_transactions": result[2],
                "perm_investments": result[3], "perm_credit_score": result[4], "perm_epf_balance": result[5]
            }
    except Exception as e:
        print(f"❌ Error fetching permissions for {user_id}: {e}")
        return {p: False for p in ["perm_assets", "perm_liabilities", "perm_transactions", "perm_investments", "perm_credit_score", "perm_epf_balance"]}

def format_permission_instructions(permissions: dict) -> str:
    """Formats a dictionary of permissions into a string for the AI prompt."""
    instructions = ["🔐 PRIVACY ENFORCEMENT RULES:"]
    data_categories = {
        "perm_assets": "Assets (property, savings, bank balances)",
        "perm_liabilities": "Liabilities (loans, debts, credit cards)",
        "perm_transactions": "Transactions (spending, income, expense records)",
        "perm_investments": "Investments (stocks, funds, portfolio data)",
        "perm_credit_score": "Credit Score information",
        "perm_epf_balance": "EPF Balance information"
    }
    
    allowed = [f"✅ ALLOWED: {desc}" for perm, desc in data_categories.items() if permissions.get(perm)]
    denied = [f"❌ DENIED: {desc}" for perm, desc in data_categories.items() if not permissions.get(perm)]
    
    if allowed:
        instructions.extend(["\n📊 YOU CAN ACCESS:", *allowed])
    if denied:
        instructions.extend(["\n🚫 YOU CANNOT ACCESS:", *denied, "\n⚠ CRITICAL: If a user asks about DENIED data, you must respond with: 'I'm sorry, I don't have access to that data.'"])
    
    instructions.append("\n🎯 STRICT RULE: Only provide insights from ALLOWED categories. Never mention or analyze DENIED data.")
    return "\n".join(instructions)