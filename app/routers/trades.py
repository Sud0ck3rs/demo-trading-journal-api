from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..db import get_session
from ..models import Trade, TradeCreate, TradeRead, TradeUpdate
from ..schemas import StatsSummary

router = APIRouter(prefix="/trades", tags=["trades"])


@router.post("/", response_model=TradeRead, status_code=status.HTTP_201_CREATED)
def create_trade(
    trade_in: TradeCreate,
    session: Session = Depends(get_session),
) -> Trade:
    """
    Create a new trade.
    """
    trade = Trade.model_validate(trade_in)
    session.add(trade)
    session.commit()
    session.refresh(trade)
    return trade


@router.get("/", response_model=List[TradeRead])
def list_trades(
    session: Session = Depends(get_session),
) -> List[Trade]:
    statement = select(Trade).order_by(Trade.entry_time)
    results = session.exec(statement).all()
    return results


@router.get("/{trade_id}", response_model=TradeRead)
def get_trade(
    trade_id: int,
    session: Session = Depends(get_session),
) -> Trade:
    """
    Return a trade by ID.
    """
    trade = session.get(Trade, trade_id)
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found",
        )
    return trade


@router.put("/{trade_id}", response_model=TradeRead)
def update_trade(
    trade_id: int,
    trade_in: TradeUpdate,
    session: Session = Depends(get_session),
) -> Trade:
    """
    Update a trade by ID (full or partial update).
    """
    trade = session.get(Trade, trade_id)
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found",
        )

    trade_data = trade_in.dict(exclude_unset=True)
    for key, value in trade_data.items():
        setattr(trade, key, value)

    session.add(trade)
    session.commit()
    session.refresh(trade)
    return trade


@router.delete("/{trade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trade(
    trade_id: int,
    session: Session = Depends(get_session),
) -> None:
    """
    Delete a trade by ID.
    """
    trade = session.get(Trade, trade_id)
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found",
        )
    session.delete(trade)
    session.commit()
    return None


@router.get("/stats/summary", response_model=StatsSummary)
def get_stats_summary(
    session: Session = Depends(get_session),
) -> StatsSummary:
    """
    Compute a simple performance summary based on closed trades.
    """
    statement = select(Trade)
    trades = session.exec(statement).all()

    total_trades = len(trades)
    if total_trades == 0:
        return StatsSummary(
            total_trades=0,
            winning_trades=0,
            losing_trades=0,
            winrate=0.0,
            realized_pnl=0.0,
            avg_win=None,
            avg_loss=None,
        )

    closed_trades = [t for t in trades if t.exit_price is not None]
    pnls = []
    wins = []
    losses = []

    for t in closed_trades:
        pnl = (t.exit_price - t.entry_price) * t.quantity * (1 if t.side == "long" else -1)
        pnls.append(pnl)
        if pnl > 0:
            wins.append(pnl)
        elif pnl < 0:
            losses.append(pnl)

    realized_pnl = sum(pnls)
    winning_trades = len(wins)
    losing_trades = len(losses)
    winrate = winning_trades / len(closed_trades) if closed_trades else 0.0
    avg_win = sum(wins) / len(wins) if wins else None
    avg_loss = sum(losses) / len(losses) if losses else None

    return StatsSummary(
        total_trades=total_trades,
        winning_trades=winning_trades,
        losing_trades=losing_trades,
        winrate=winrate,
        realized_pnl=realized_pnl,
        avg_win=avg_win,
        avg_loss=avg_loss,
    )
