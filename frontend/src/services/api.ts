import { Trade, TradeCreate, StatsSummary } from '../types/trade';

const API_BASE_URL = '/api';

export const api = {
  async getTrades(): Promise<Trade[]> {
    const response = await fetch(`${API_BASE_URL}/trades/`);
    if (!response.ok) throw new Error('Failed to fetch trades');
    return response.json();
  },

  async getTrade(id: number): Promise<Trade> {
    const response = await fetch(`${API_BASE_URL}/trades/${id}`);
    if (!response.ok) throw new Error('Failed to fetch trade');
    return response.json();
  },

  async createTrade(trade: TradeCreate): Promise<Trade> {
    const response = await fetch(`${API_BASE_URL}/trades/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade),
    });
    if (!response.ok) throw new Error('Failed to create trade');
    return response.json();
  },

  async updateTrade(id: number, trade: Partial<TradeCreate>): Promise<Trade> {
    const response = await fetch(`${API_BASE_URL}/trades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade),
    });
    if (!response.ok) throw new Error('Failed to update trade');
    return response.json();
  },

  async deleteTrade(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/trades/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete trade');
  },

  async getStats(): Promise<StatsSummary> {
    const response = await fetch(`${API_BASE_URL}/trades/stats/summary`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};
