import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types/trade';

interface TradeTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: number) => void;
}

export function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  const calculatePnL = (trade: Trade) => {
    if (!trade.exit_price) return null;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity * (trade.side === 'long' ? 1 : -1);
    return pnl;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Side
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Entry Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Exit Price
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                P&L
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Entry Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Strategy
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trades.map((trade) => {
              const pnl = calculatePnL(trade);
              return (
                <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">{trade.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        trade.side === 'long'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {trade.side === 'long' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {trade.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {formatCurrency(trade.entry_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                    {trade.exit_price ? formatCurrency(trade.exit_price) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {pnl !== null ? (
                      <span
                        className={`font-semibold ${
                          pnl > 0 ? 'text-green-600' : pnl < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        {formatCurrency(pnl)}
                      </span>
                    ) : (
                      <span className="text-gray-400">Open</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {formatDate(trade.entry_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {trade.strategy_tag ? (
                      <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {trade.strategy_tag}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(trade)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit trade"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(trade.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete trade"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {trades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trades yet. Create your first trade to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
