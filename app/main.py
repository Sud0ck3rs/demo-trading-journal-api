from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_db
from .routers import trades


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
app.include_router(trades.router)
