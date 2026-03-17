import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AllTransactions() {
  const [data, setData] = useState({ transactions: [], total: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/transactions/all').then(r => setData(r.data.data || r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;
  const typeColors = { BORROW: 'badge-info', RETURN: 'badge-success', FINE_PAYMENT: 'badge-warning', BOOK_PURCHASE: 'badge-neutral', DONATION: 'badge-success', RENEWAL: 'badge-info' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-100">All Transactions</h1><span className="text-sm text-gray-500">{data.total} total</span></div>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th><th className="text-left p-4 text-sm font-semibold text-gray-400">User</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Description</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Amount</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th></tr></thead>
          <tbody>{(data.transactions || []).map(t => (
            <tr key={t.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4"><span className={`badge ${typeColors[t.type] || 'badge-neutral'}`}>{t.type}</span></td><td className="p-4 text-sm text-gray-300">{t.user?.name}</td><td className="p-4 text-sm text-gray-400">{t.description}</td><td className="p-4 text-sm text-gray-300">{t.amount > 0 ? `₹${t.amount.toFixed(2)}` : '-'}</td><td className="p-4 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td></tr>
          ))}</tbody></table>
      </div>
    </div>
  );
}
