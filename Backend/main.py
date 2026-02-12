# /main.py

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy
import traceback
from contextlib import asynccontextmanager
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from api.v1.router import api_router
from services.ai_agent import init_agent # This now returns two things
from config.database import get_engine
from config.rate_limiter import limiter

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server is starting up...")
    try:
        # CHANGED: init_agent now returns the executor and a session history manager
        agent_executor, session_manager = init_agent()
        app.state.agent_executor = agent_executor
        app.state.get_session_history = session_manager
        print("Startup complete. Conversational Agent is attached to app state.")
    except Exception as e:
        print(f"CRITICAL ERROR during startup AI initialization: {e}")
        print(f"Full traceback: {traceback.format_exc()}")
        app.state.agent_executor = None
        app.state.get_session_history = None
    
    yield
    print(" shutting down...")

# --- The rest of your main.py file remains the same ---
app = FastAPI(
    title="AI Personal Finance Assistant",
    description="An API that allows natural language questions about financial data.",
    version="1.0.0",
    lifespan=lifespan
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    return response

@app.get("/")
def health_check():
    return {"status": "✅ API is running. Navigate to /docs for API documentation."}

@app.get("/ping-db")
def ping_db():
    try:
        engine = get_engine()
        engine.dispose()
        return {"status": "✅ Database connection is alive and well."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Database connection failed: {e}")

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
