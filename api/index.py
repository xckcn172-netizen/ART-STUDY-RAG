import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Set environment for Vercel
os.environ.setdefault("CHROMA_PERSIST_DIR", "/tmp/chroma")

# Import FastAPI app
from app.main import app

# Vercel requires this to be named 'app'
app = app
