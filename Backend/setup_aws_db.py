"""
AWS RDS Database Setup Script
Creates all tables in your AWS RDS PostgreSQL database
"""

import os
import sys
import urllib.parse
import sqlalchemy
from sqlalchemy import Column, String, Integer, Boolean, Float, Date, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_USER = os.environ.get("DB_USER", "postgres")
raw_pass = os.environ.get("DB_PASS", "default_password")
DB_PASS = urllib.parse.quote_plus(raw_pass)
DB_NAME = os.environ.get("DB_NAME", "fintrack")
DB_HOST = os.environ.get("DB_HOST", "127.0.0.1")
DB_PORT = os.environ.get("DB_PORT", "5432")

# Create database URI
db_uri = f"postgresql+pg8000://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

print("=" * 60)
print("🚀 AWS RDS Database Setup")
print("=" * 60)
print(f"📍 Connecting to: {DB_HOST}")
print(f"📦 Database: {DB_NAME}")
print(f"👤 User: {DB_USER}")
print("=" * 60)

# Define the Base
Base = declarative_base()

# Define all models (same as models.py)
class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    credit_score = Column(Integer, nullable=True)
    epf_balance = Column(Float, nullable=True)

    # AI Permission Controls
    perm_assets = Column(Boolean, default=True)
    perm_liabilities = Column(Boolean, default=True) 
    perm_transactions = Column(Boolean, default=True)
    perm_investments = Column(Boolean, default=True)
    perm_credit_score = Column(Boolean, default=True)
    perm_epf_balance = Column(Boolean, default=True)

class Asset(Base):
    __tablename__ = 'assets'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    value = Column(Float, nullable=False)

class Liability(Base):
    __tablename__ = 'liabilities'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    outstanding_balance = Column(Float, nullable=False)

class Investment(Base):
    __tablename__ = 'investments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False)
    name = Column(String, nullable=False)
    ticker = Column(String, nullable=False)
    type = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    purchase_date = Column(Date, nullable=True)  # Added field from your agent.py

class Transaction(Base):
    __tablename__ = 'transactions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey('users.user_id'), nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)

def create_database():
    """Create all tables in the database"""
    try:
        print("\n🔌 Connecting to AWS RDS...")
        engine = sqlalchemy.create_engine(db_uri)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected successfully!")
            print(f"📊 PostgreSQL version: {version[:50]}...")
        
        print("\n🏗️  Creating tables...")
        Base.metadata.create_all(engine)
        
        print("✅ All tables created successfully!")
        
        # List all tables
        print("\n📋 Tables in database:")
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            tables = result.fetchall()
            for table in tables:
                print(f"   ✓ {table[0]}")
        
        print("\n" + "=" * 60)
        print("🎉 Database setup complete!")
        print("=" * 60)
        print("\n💡 Next steps:")
        print("   1. Run data_ingestion.py to import your data")
        print("   2. Start your FastAPI server: uvicorn main:app --reload")
        print("   3. Test the connection: http://localhost:8000/ping-db")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n🔍 Troubleshooting:")
        print("   1. Check your .env file has correct credentials")
        print("   2. Verify security group allows your IP on port 5432")
        print("   3. Ensure RDS instance is in 'Available' status")
        print("   4. Check the endpoint URL is correct")
        return False

if __name__ == "__main__":
    success = create_database()
    sys.exit(0 if success else 1)
