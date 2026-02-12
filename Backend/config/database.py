# /config/database.py

import os
import urllib.parse
import sqlalchemy
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.environ.get("DB_USER", "postgres")
raw_pass = os.environ.get("DB_PASS", "default_password")
DB_PASS = urllib.parse.quote_plus(raw_pass)
DB_NAME = os.environ.get("DB_NAME", "fintrack")
DB_HOST = os.environ.get("DB_HOST", "127.0.0.1")  # Can be GCP IP or AWS RDS endpoint
DB_PORT = os.environ.get("DB_PORT", "5432")

def get_engine():
    """Creates and returns a new SQLAlchemy engine."""
    db_uri = f"postgresql+pg8000://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    try:
        engine = sqlalchemy.create_engine(db_uri)
        with engine.connect():
            pass
        return engine
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        raise

try:
    engine = get_engine()
    print("✅ Database engine created successfully.")
except Exception as e:
    engine = None
    print(f"🔥 Failed to create database engine on startup: {e}")