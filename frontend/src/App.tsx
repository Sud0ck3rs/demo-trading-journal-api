import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Target, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { Trade, TradeCreate, StatsSummary } from './types/trade';
import { api } from './services/api';
import { StatsCard } from './components/StatsCard';
import { TradeForm } from './components/TradeForm';
import { TradeTable } from './components/TradeTable';

function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tradesData, statsData] = await Promise.all([
        api.getTrades(),
        api.getStats(),
      ]);
      setTrades(tradesData);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load data. Make sure your API is running on http://localhost:8000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTrade = async (trade: TradeCreate) => {
    try {
      await api.createTrade(trade);
      await loadData();
      setShowForm(false);
    } catch (err) {
      alert('Failed to create trade');
      console.error(err);
    }
  };

  const handleUpdateTrade = async (trade: TradeCreate) => {
    if (!editingTrade) return;
    try {
      await api.updateTrade(editingTrade.id, trade);
      await loadData();
      setEditingTrade(null);
    } catch (err) {
      alert('Failed to update trade');
      console.error(err);
    }
  };

  const handleDeleteTrade = async (id: number) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;
    try {
      await api.deleteTrade(id);
      await loadData();
    } catch (err) {
      alert('Failed to delete trade');
      console.error(err);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your trading journal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={20} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-xl p-3">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Trading Journal</h1>
                <p className="text-gray-600 mt-1">Track and analyze your trading performance</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              New Trade
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              label="Total Trades"
              value={stats.total_trades}
              icon={<Target size={32} />}
              trend="neutral"
            />
            <StatsCard
              label="Win Rate"
              value={formatPercent(stats.winrate)}
              icon={<TrendingUp size={32} />}
              trend={stats.winrate >= 0.5 ? 'up' : 'down'}
            />
            <StatsCard
              label="Realized P&L"
              value={formatCurrency(stats.realized_pnl)}
              icon={<DollarSign size={32} />}
              trend={stats.realized_pnl > 0 ? 'up' : stats.realized_pnl < 0 ? 'down' : 'neutral'}
            />
            <StatsCard
              label="Avg Win / Avg Loss"
              value={
                stats.avg_win && stats.avg_loss
                  ? `${formatCurrency(stats.avg_win)} / ${formatCurrency(stats.avg_loss)}`
                  : '—'
              }
              icon={<BarChart3 size={32} />}
              trend="neutral"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Trade History</h2>
            <button
              onClick={loadData}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-white rounded-lg transition-colors"
              title="Refresh data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
          <TradeTable
            trades={trades}
            onEdit={setEditingTrade}
            onDelete={handleDeleteTrade}
          />
        </div>
      </div>

      {showForm && (
        <TradeForm
          onSubmit={handleCreateTrade}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTrade && (
        <TradeForm
          onSubmit={handleUpdateTrade}
          onClose={() => setEditingTrade(null)}
          initialData={editingTrade}
        />
      )}
    </div>
  );
}

export default App;
