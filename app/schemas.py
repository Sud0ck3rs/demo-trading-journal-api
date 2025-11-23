from __future__ import annotations

from typing import Optional

from sqlmodel import SQLModel


class StatsSummary(SQLModel):
    total_trades: int
    winning_trades: int
    losing_trades: int
    winrate: float
    realized_pnl: float
    avg_win: Optional[float] = None
    avg_loss: Optional[float] = None
