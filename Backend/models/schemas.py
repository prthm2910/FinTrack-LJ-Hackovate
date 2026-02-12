# /models/schemas.py

from pydantic import BaseModel

class QueryRequest(BaseModel):
    """Model for the AI agent's question request."""
    question: str
    user_id: str