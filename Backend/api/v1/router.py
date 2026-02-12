# /api/v1/router.py

from fastapi import APIRouter
from .endpoints import ai, users, dashboard, data_entry

api_router = APIRouter()

api_router.include_router(ai.router, tags=["AI Services"])
api_router.include_router(users.router, tags=["User Management"])
api_router.include_router(dashboard.router, tags=["Dashboard & Data"])
api_router.include_router(data_entry.router, tags=["Data Entry"])