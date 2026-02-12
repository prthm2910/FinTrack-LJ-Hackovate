# /api/v1/endpoints/data_entry.py

from fastapi import APIRouter, HTTPException # type: ignore
import sqlalchemy # type: ignore
from config.database import engine

router = APIRouter()

def check_db_engine():
    if not engine:
        raise HTTPException(status_code=503, detail="Database connection is not available.")

@router.post("/transactions")
async def add_transaction(request: dict):
    """Add new transaction"""
    check_db_engine()
    user_id = request.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("""
                INSERT INTO transactions (user_id, date, description, category, amount, type)
                VALUES (:user_id, :date, :description, :category, :amount, :type)
            """)
            conn.execute(stmt, {k: request.get(k) for k in ["user_id", "date", "description", "category", "amount", "type"]})
            conn.commit()
            return {"message": "Transaction added successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/assets")
async def add_asset(request: dict):
    """Add new asset"""
    check_db_engine()
    user_id = request.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("INSERT INTO assets (user_id, name, type, value) VALUES (:user_id, :name, :type, :value)")
            conn.execute(stmt, {k: request.get(k) for k in ["user_id", "name", "type", "value"]})
            conn.commit()
            return {"message": "Asset added successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/investments")
async def add_investment(request: dict):
    """Add new investment"""
    check_db_engine()
    user_id = request.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("""
                INSERT INTO investments (user_id, name, ticker, type, quantity, current_value, purchase_date)
                VALUES (:user_id, :name, :ticker, :type, :quantity, :current_value, :purchase_date)
            """)
            conn.execute(stmt, {k: request.get(k) for k in ["user_id", "name", "ticker", "type", "quantity", "current_value", "purchase_date"]})
            conn.commit()
            return {"message": "Investment added successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/liabilities")
async def add_liability(request: dict):
    """Add new liability"""
    check_db_engine()
    user_id = request.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required")
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("INSERT INTO liabilities (user_id, name, type, outstanding_balance) VALUES (:user_id, :name, :type, :outstanding_balance)")
            conn.execute(stmt, {k: request.get(k) for k in ["user_id", "name", "type", "outstanding_balance"]})
            conn.commit()
            return {"message": "Liability added successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))