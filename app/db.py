from __future__ import annotations

from typing import Generator

from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./trading_journal.db"

engine = create_engine(DATABASE_URL, echo=False)


def init_db() -> None:
    """
    Create database tables.
    """
    from . import models  # ensure models are imported

    SQLModel.metadata.create_all(bind=engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.
    """
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
