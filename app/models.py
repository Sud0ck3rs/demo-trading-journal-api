from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class TradeBase(SQLModel):
    symbol: str
    side: str  # "long" or "short"
    quantity: float
    entry_price: float
    exit_price: Optional[float] = None
    entry_time: datetime
    exit_time: Optional[datetime] = None

    strategy_tag: Optional[str] = None
    notes: Optional[str] = None


class Trade(TradeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class TradeCreate(TradeBase):
    """
    Schema for creating a new trade.
    """
    pass


class TradeRead(TradeBase):
    """
    Schema for reading a trade.
    """
    id: int


class TradeUpdate(SQLModel):
    """
    Schema for partial updates.
    All fields are optional.
    """
    symbol: Optional[str] = None
    side: Optional[str] = None
    quantity: Optional[float] = None
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    entry_time: Optional[datetime] = None
    exit_time: Optional[datetime] = None
    strategy_tag: Optional[str] = None
    notes: Optional[str] = None
