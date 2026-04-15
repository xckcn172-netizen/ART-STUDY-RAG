import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Set environment variables for Vercel
os.environ.setdefault("CHROMA_PERSIST_DIR", "/tmp/chroma")

from app.main import app

# Vercel Serverless Function handler
def handler(request):
    """
    Vercel Serverless Function handler
    """
    # Import ASGI handler for Vercel
    from mangum import Mangum

    asgi_handler = Mangum(app)
    return asgi_handler({
        'type': 'http',
        'method': request.method,
        'path': request.path,
        'query_string': request.query_string,
        'headers': dict(request.headers),
        'body': request.body
    })

# For Vercel Python runtime
app_handler = app
