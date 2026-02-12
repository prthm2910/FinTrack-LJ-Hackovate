# /api/v1/endpoints/dashboard.py

from fastapi import APIRouter, HTTPException, Query # type: ignore
from typing import Optional
import sqlalchemy # type: ignore
from config.database import engine

router = APIRouter()

def check_db_engine():
    if not engine:
        raise HTTPException(status_code=503, detail="Database connection is not available.")

# In api/v1/endpoints/dashboard.py

@router.get("/dashboard/summary")
async def get_dashboard_summary(user_id: str):
    """Get financial summary for dashboard"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            user_res = conn.execute(sqlalchemy.text("SELECT credit_score, epf_balance FROM Users WHERE user_id = :user_id"), {"user_id": user_id}).fetchone()
            assets = conn.execute(sqlalchemy.text("SELECT COALESCE(SUM(value), 0) FROM Assets WHERE user_id = :user_id"), {"user_id": user_id}).scalar_one()
            liabilities = conn.execute(sqlalchemy.text("SELECT COALESCE(SUM(outstanding_balance), 0) FROM Liabilities WHERE user_id = :user_id"), {"user_id": user_id}).scalar_one()
            investments = conn.execute(sqlalchemy.text("SELECT COALESCE(SUM(current_value), 0) FROM Investments WHERE user_id = :user_id"), {"user_id": user_id}).scalar_one()
            
            return {
                "total_assets": float(assets),
                "total_liabilities": float(liabilities),
                "investment_portfolio": float(investments),
                
                # CHANGED: Added 'and user_res[1] is not None' to handle NULL from DB
                "epf_balance": float(user_res[1]) if user_res and user_res[1] is not None else 0.0,
                
                # CHANGED: Added 'and user_res[0] is not None' to handle NULL from DB
                "credit_score": int(user_res[0]) if user_res and user_res[0] is not None else 0
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/recent-transactions")
async def get_recent_transactions(user_id: str):
    """Get recent 5 transactions for dashboard"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            result = conn.execute(
                sqlalchemy.text("""
                    SELECT date, description, category, amount 
                    FROM Transactions 
                    WHERE user_id = :user_id 
                    ORDER BY date DESC 
                    LIMIT 5
                """),
                {"user_id": user_id}
            ).fetchall()
            
            transactions = []
            for row in result:
                transactions.append({
                    "date": str(row[0]),
                    "description": row[1], # CORRECTED: Changed "name" to "description"
                    "category": row[2],
                    "amount": float(row[3])
                })
            
            return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions/all")
async def get_all_transactions(user_id: str, page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100)):
    """Get all transactions with pagination"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            offset = (page - 1) * limit
            query = sqlalchemy.text("SELECT date, description, category, amount, type FROM transactions WHERE user_id = :user_id ORDER BY date DESC LIMIT :limit OFFSET :offset")
            result = conn.execute(query, {"user_id": user_id, "limit": limit, "offset": offset}).fetchall()
            
            total_count = conn.execute(sqlalchemy.text("SELECT COUNT(*) FROM transactions WHERE user_id = :user_id"), {"user_id": user_id}).scalar_one()
            
            transactions = [{"date": str(row[0]), "description": row[1], "category": row[2], "amount": float(row[3]), "type": row[4]} for row in result]
            
            return {"transactions": transactions, "totalCount": total_count, "totalPages": (total_count + limit - 1) // limit, "currentPage": page}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/charts")
async def get_dashboard_charts(user_id: str, period: str = "6months"):
    """
    Get chart data for dashboard - optimized for your React Charts component
    """
    check_db_engine()
    try:
        with engine.connect() as conn:
            # Map period to SQL interval
            interval_map = {
                "3months": "3 months",
                "6months": "6 months", 
                "1year": "12 months",
                "2years": "24 months"
            }
            interval_value = interval_map.get(period.lower(), "6 months")
            
            # 1. MONTHLY SPENDING TRENDS (Bar Chart)
            spending_data = conn.execute(
                sqlalchemy.text(f"""
                    SELECT 
                        TO_CHAR(DATE_TRUNC('month', date), 'Mon') AS month,
                        SUM(ABS(amount)) AS total_spending
                    FROM Transactions 
                    WHERE user_id = :user_id 
                        AND type = 'expense'
                        AND date >= CURRENT_DATE - INTERVAL '{interval_value}'
                    GROUP BY DATE_TRUNC('month', date), month
                    ORDER BY DATE_TRUNC('month', date)
                """),
                {"user_id": user_id}
            ).fetchall()
            
            spending_labels = [row[0] for row in spending_data] if spending_data else ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            spending_values = [float(row[1]) for row in spending_data] if spending_data else [1200, 1900, 1500, 1700, 1600, 2100]
            
            # 2. MONTHLY SAVINGS TRENDS (Line Chart)
            savings_data = conn.execute(
                sqlalchemy.text(f"""
                    SELECT 
                        TO_CHAR(DATE_TRUNC('month', date), 'Mon') AS month,
                        SUM(CASE WHEN type = 'income' THEN amount ELSE -ABS(amount) END) AS net_savings
                    FROM Transactions 
                    WHERE user_id = :user_id 
                        AND date >= CURRENT_DATE - INTERVAL '{interval_value}'
                    GROUP BY DATE_TRUNC('month', date), month
                    ORDER BY DATE_TRUNC('month', date)
                """),
                {"user_id": user_id}
            ).fetchall()
            
            savings_labels = [row[0] for row in savings_data] if savings_data else ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            savings_values = [float(row[1]) for row in savings_data] if savings_data else [500, 600, 800, 750, 900, 1100]
            
            # 3. INVESTMENT PORTFOLIO TRENDS (Line Chart)
            current_portfolio = conn.execute(
                sqlalchemy.text("SELECT COALESCE(SUM(current_value), 65000) FROM Investments WHERE user_id = :user_id"),
                {"user_id": user_id}
            ).scalar_one()
            
            portfolio_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            base_value = float(current_portfolio) * 0.9  # Start 10% lower
            portfolio_values = [
                base_value + (i * base_value * 0.02) for i in range(6)
            ]
            
            # 4. PORTFOLIO ALLOCATION (Pie Chart)
            allocation_data = conn.execute(
                sqlalchemy.text("""
                    SELECT 
                        type AS allocation_category,
                        SUM(current_value) AS total_value
                    FROM Investments 
                    WHERE user_id = :user_id
                    GROUP BY allocation_category
                    ORDER BY total_value DESC
                """),
                {"user_id": user_id}
            ).fetchall()
            
            allocation_labels = [row[0] for row in allocation_data] if allocation_data else ["Stocks", "Bonds", "Real Estate", "Crypto"]
            allocation_values = [float(row[1]) for row in allocation_data] if allocation_data else [35000, 20000, 10000, 5000]
            
            return {
                "spending_chart": {
                    "labels": spending_labels,
                    "data": spending_values
                },
                "savings_chart": {
                    "labels": savings_labels,
                    "data": savings_values
                },
                "investment_chart": {
                    "labels": portfolio_labels,
                    "data": portfolio_values
                },
                "allocation_chart": {
                    "labels": allocation_labels,
                    "data": allocation_values
                },
                "period": period
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))