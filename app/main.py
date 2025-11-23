from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .db import init_db
from .routers import trades

import logging


# Paths
BASE_DIR = Path(__file__).resolve().parent.parent  # root project backend
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize database on startup.
    """
    init_db()
    yield


app = FastAPI(
    title="Trading Journal API",
    version="0.1.0",
    description="A simple FastAPI backend to store and analyze trading journal entries.",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Create React App
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check() -> dict:
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}


# Include routers
app.include_router(trades.router, prefix="/api")

logger = logging.getLogger("uvicorn.error")

# React frontend build
# Make sure you ran: cd frontend && npm run build
if FRONTEND_DIST.exists():
    # Serve all static frontend files (index.html, assets, etc.)
    app.mount(
        "/",  # all non-/api routes fall back to the React frontend
        StaticFiles(directory=FRONTEND_DIST, html=True),
        name="frontend",
    )
else:
    # Optional: log a warning if the build folder does not exist
    logger.warning("Frontend build not found at %s", FRONTEND_DIST)