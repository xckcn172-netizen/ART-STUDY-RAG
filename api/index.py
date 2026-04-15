import os
import sys
from pathlib import Path

# Add backend to Python path
backend_path = str(Path(__file__).parent.parent / "backend")
sys.path.insert(0, backend_path)

# Set environment for Vercel serverless
os.environ.setdefault("CHROMA_PERSIST_DIR", "/tmp/chroma")

# Export FastAPI app directly - Vercel supports ASGI natively
from app.main import app
