"""
AWS RDS Database Setup Script
==============================
This script creates the 'fintrack' database on your AWS RDS instance.
Run this BEFORE running create_schema.py

Usage: python setup_rds.py
"""

import os
import urllib.parse
import sqlalchemy
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Connect to RDS and create the fintrack database"""
    
    # Get credentials from .env
    DB_USER = os.environ.get("DB_USER", "postgres")
    raw_pass = os.environ.get("DB_PASS", "default_password")
    DB_PASS = urllib.parse.quote_plus(raw_pass)
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = os.environ.get("DB_PORT", "5432")
    DB_NAME = os.environ.get("DB_NAME", "fintrack")
    
    print("🔌 Connecting to AWS RDS instance...")
    print(f"   Host: {DB_HOST}")
    print(f"   User: {DB_USER}")
    print(f"   Port: {DB_PORT}")
    
    # Connect to the default 'postgres' database first
    default_db_uri = f"postgresql+pg8000://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/postgres"
    
    try:
        # Create engine for default database
        engine = sqlalchemy.create_engine(default_db_uri, isolation_level="AUTOCOMMIT")
        
        with engine.connect() as conn:
            print("✅ Connected to RDS instance successfully!")
            
            # Check if database already exists
            result = conn.execute(text(
                f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'"
            ))
            
            if result.fetchone():
                print(f"ℹ️  Database '{DB_NAME}' already exists!")
            else:
                # Create the database
                print(f"🔨 Creating database '{DB_NAME}'...")
                conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
                print(f"✅ Database '{DB_NAME}' created successfully!")
            
            print("\n🎉 Setup complete!")
            print(f"📝 Next step: Run 'python create_schema.py' to create tables")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔍 Troubleshooting tips:")
        print("   1. Check your .env file has correct credentials")
        print("   2. Verify RDS security group allows your IP on port 5432")
        print("   3. Ensure RDS instance is in 'Available' state")
        print("   4. Check if RDS endpoint is correct")
        raise

if __name__ == "__main__":
    create_database()
