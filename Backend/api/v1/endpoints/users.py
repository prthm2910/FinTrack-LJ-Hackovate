# /api/v1/endpoints/users.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import sqlalchemy
from config.database import engine

router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    credit_score: int | None = Field(default=None)
    epf_balance: float | None = Field(default=None)

def check_db_engine():
    if not engine:
        raise HTTPException(status_code=503, detail="Database connection is not available.")

@router.get("/users/me")
async def get_current_user(user_id: str):
    check_db_engine()
    # ... (code for this endpoint)
    pass

@router.post("/users/update-profile")
async def update_user_profile(user_id: str, request: ProfileUpdateRequest):
    check_db_engine()
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("UPDATE Users SET credit_score = :credit_score, epf_balance = :epf_balance WHERE user_id = :user_id")
            result = conn.execute(stmt, {"user_id": user_id, "credit_score": request.credit_score, "epf_balance": request.epf_balance})
            conn.commit()
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="User not found")
            return {"message": "Profile updated successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/users/update-permissions")
async def update_ai_permissions(permissions: dict, user_id: str):
    """Update AI access permissions for user data"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            stmt = sqlalchemy.text("""
                UPDATE Users SET perm_assets = :perm_assets, perm_liabilities = :perm_liabilities,
                    perm_transactions = :perm_transactions, perm_investments = :perm_investments,
                    perm_credit_score = :perm_credit_score, perm_epf_balance = :perm_epf_balance
                WHERE user_id = :user_id
            """)
            result = conn.execute(stmt, {
                "user_id": user_id, **{k: permissions.get(k, True) for k in ["perm_assets", "perm_liabilities", "perm_transactions", "perm_investments", "perm_credit_score", "perm_epf_balance"]}
            })
            conn.commit()
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="User not found")
            return {"message": "AI permissions updated successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/users/create")
async def create_user(user_data: dict):
    """Create new user account"""
    check_db_engine()
    try:
        if "user_id" not in user_data or "name" not in user_data:
            raise HTTPException(status_code=400, detail="Missing required fields: user_id, name")
        
        with engine.connect() as conn:
            existing = conn.execute(sqlalchemy.text("SELECT user_id FROM Users WHERE user_id = :user_id"), {"user_id": user_data["user_id"]}).fetchone()
            if existing:
                raise HTTPException(status_code=409, detail="User already exists")
            
            stmt = sqlalchemy.text("""
                INSERT INTO Users (user_id, name, credit_score, epf_balance, perm_assets, perm_liabilities, 
                 perm_transactions, perm_investments, perm_credit_score, perm_epf_balance)
                VALUES (:user_id, :name, :credit_score, :epf_balance, :perm_assets, :perm_liabilities,
                 :perm_transactions, :perm_investments, :perm_credit_score, :perm_epf_balance)
            """)
            conn.execute(stmt, {
                "user_id": user_data["user_id"], "name": user_data["name"], "credit_score": user_data.get("credit_score", 0),
                "epf_balance": user_data.get("epf_balance", 0.0), "perm_assets": user_data.get("perm_assets", True),
                "perm_liabilities": user_data.get("perm_liabilities", True), "perm_transactions": user_data.get("perm_transactions", True),
                "perm_investments": user_data.get("perm_investments", True), "perm_credit_score": user_data.get("perm_credit_score", True),
                "perm_epf_balance": user_data.get("perm_epf_balance", True)
            })
            conn.commit()
            return {"message": "User created successfully", "status": "success", "user_id": user_data["user_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/delete-account")
async def delete_user_account(user_id: str):
    """Delete user account and all associated data"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            if not conn.execute(sqlalchemy.text("SELECT user_id FROM Users WHERE user_id = :user_id"), {"user_id": user_id}).fetchone():
                raise HTTPException(status_code=404, detail="User not found")
            
            for table in ["Transactions", "Assets", "Liabilities", "Investments", "Users"]:
                conn.execute(sqlalchemy.text(f"DELETE FROM {table} WHERE user_id = :user_id"), {"user_id": user_id})
            conn.commit()
            return {"message": "User account deleted successfully", "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users/profile-summary")
async def get_profile_summary(user_id: str):
    """Get quick profile summary for header/navigation"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            result = conn.execute(sqlalchemy.text("SELECT name, credit_score FROM Users WHERE user_id = :user_id"), {"user_id": user_id}).fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="User not found")
            
            name_parts = result[0].split()
            initials = "".join([part[0].upper() for part in name_parts[:2]]) if name_parts else "U"
            
            return {"name": result[0], "credit_score": result[1], "initials": initials, "email": f"{result[0].lower().replace(' ', '.')}@financio.com"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users/stats")
async def get_user_stats(user_id: str):
    """Get user statistics (total records, etc.)"""
    check_db_engine()
    try:
        with engine.connect() as conn:
            counts = {}
            for table in ["Transactions", "Assets", "Investments", "Liabilities"]:
                key = f"{table.lower()[:-1]}_count" if table.endswith('s') else f"{table.lower()}_count"
                counts[key] = conn.execute(sqlalchemy.text(f"SELECT COUNT(*) FROM {table} WHERE user_id = :user_id"), {"user_id": user_id}).scalar_one()
            
            counts["total_records"] = sum(counts.values())
            return counts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))