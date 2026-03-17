import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyTransactions() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/transactions/my').then(r => setTxns(r.data.data || r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;
  const typeColors = { BORROW: 'badge-info', RETURN: 'badge-success', FINE_PAYMENT: 'badge-warning', BOOK_PURCHASE: 'badge-neutral', DONATION: 'badge-success', RENEWAL: 'badge-info' };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">My Transactions</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Description</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Amount</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th></tr></thead>
          <tbody>{txns.map(t => (
            <tr key={t.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4"><span className={`badge ${typeColors[t.type] || 'badge-neutral'}`}>{t.type}</span></td><td className="p-4 text-sm text-gray-300">{t.description}</td><td className="p-4 text-sm text-gray-400">{t.book?.title || '-'}</td><td className="p-4 text-sm text-gray-300">{t.amount > 0 ? `₹${t.amount.toFixed(2)}` : '-'}</td><td className="p-4 text-sm text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td></tr>
          ))}{txns.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No transactions yet.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
