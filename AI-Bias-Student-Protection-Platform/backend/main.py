import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database.db import init_db
from api.routes import router

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="EquiLens API",
    description="AI Bias Mitigation & Student Protection Platform - Complete End-to-End Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "EquiLens AI Bias & Candidate Protection Engine",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# Register API router
app.include_router(router, prefix="/api")

# Static frontend serving
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist"))
assets_dir = os.path.join(frontend_dist, "assets")

if os.path.isdir(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

if os.path.isfile(os.path.join(frontend_dist, "index.html")):
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Allow API and documentation paths to resolve naturally or 404
        if full_path in ["docs", "openapi.json", "health"] or full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        target_file = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root_health():
        return {
            "status": "ONLINE",
            "service": "EquiLens AI Bias & Candidate Protection Engine",
            "version": "1.0.0",
            "docs_url": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
