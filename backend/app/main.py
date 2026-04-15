from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import api_router
from .dependencies import get_settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Art Study RAG System - 留学美术生复习系统",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": "Art Study RAG System API",
        "version": "1.0.0",
        "docs": "/docs",
        "api": "/api"
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}


@app.on_event("startup")
async def startup_event():
    """
    Startup event handler
    """
    import os
    os.makedirs(settings.CHROMA_PERSIST_DIR, exist_ok=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
