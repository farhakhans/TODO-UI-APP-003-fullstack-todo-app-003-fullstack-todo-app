from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from src.api import auth, tasks, ai_agent

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="REST API for the Full-Stack Todo Web Application",
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # Allow both local frontend (port 3000) and production frontend
    allow_origins=(
        settings.BACKEND_CORS_ORIGINS.split(",")
        if settings.BACKEND_CORS_ORIGINS != "*"
        else ["*"]
    ) + [
        "https://frontend-fjp2z60tz-farhakhans-projects.vercel.app",  # Production frontend
        "http://localhost:3000",  # Local frontend development
        "http://localhost:3001",  # Alternative local frontend port
        "http://localhost:3002",  # Another alternative local frontend port
        "http://127.0.0.1:3000",  # Alternative localhost format
        "http://127.0.0.1:3001",  # Alternative localhost format
        "http://127.0.0.1:3002",  # Alternative localhost format
    ],
      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(ai_agent.router, prefix="/api/ai", tags=["AI Agent"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo Application API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)