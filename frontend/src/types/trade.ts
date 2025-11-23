export interface Trade {
  id: number;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entry_price: number;
  exit_price: number | null;
  entry_time: string;
  exit_time: string | null;
  strategy_tag: string | null;
  notes: string | null;
}

export interface TradeCreate {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entry_price: number;
  exit_price?: number | null;
  entry_time: string;
  exit_time?: string | null;
  strategy_tag?: string | null;
  notes?: string | null;
}

export interface StatsSummary {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  winrate: number;
  realized_pnl: number;
  avg_win: number | null;
  avg_loss: number | null;
}
