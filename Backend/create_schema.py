"""
Schema Creation Script for AWS RDS
Creates all tables needed for FinTrack application
Run this ONCE after creating a blank AWS RDS database
"""

import sqlalchemy
from sqlalchemy import text
from config.database import get_engine

def create_schema():
    """Create all database tables"""
    engine = get_engine()
    
    with engine.connect() as conn:
        print("🔨 Creating database schema...")
        
        # Create Users table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Users (
                user_id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                credit_score INTEGER,
                epf_balance FLOAT,
                perm_assets BOOLEAN DEFAULT TRUE,
                perm_liabilities BOOLEAN DEFAULT TRUE,
                perm_transactions BOOLEAN DEFAULT TRUE,
                perm_investments BOOLEAN DEFAULT TRUE,
                perm_credit_score BOOLEAN DEFAULT TRUE,
                perm_epf_balance BOOLEAN DEFAULT TRUE
            )
        """))
        print("✅ Users table created")
        
        # Create Transactions table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                date DATE NOT NULL,
                description VARCHAR NOT NULL,
                category VARCHAR NOT NULL,
                amount FLOAT NOT NULL,
                type VARCHAR NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        """))
        print("✅ Transactions table created")
        
        # Create Assets table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Assets (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                name VARCHAR NOT NULL,
                type VARCHAR NOT NULL,
                value FLOAT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        """))
        print("✅ Assets table created")
        
        # Create Liabilities table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Liabilities (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                name VARCHAR NOT NULL,
                type VARCHAR NOT NULL,
                outstanding_balance FLOAT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        """))
        print("✅ Liabilities table created")
        
        # Create Investments table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS Investments (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR NOT NULL,
                name VARCHAR NOT NULL,
                ticker VARCHAR NOT NULL,
                type VARCHAR NOT NULL,
                quantity FLOAT NOT NULL,
                current_value FLOAT NOT NULL,
                purchase_date DATE,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            )
        """))
        print("✅ Investments table created")
        
        conn.commit()
        print("\n🎉 Schema creation complete!")
        print("📝 Next step: Run data_ingestion.py to populate with data.json")

if __name__ == "__main__":
    try:
        create_schema()
    except Exception as e:
        print(f"❌ Error creating schema: {e}")
        raise
