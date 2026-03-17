import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function MyFines() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => { try { const { data } = await api.get('/fines/my'); setFines(data.data || data); } catch { toast.error('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const handlePay = async (id) => { try { await api.post(`/fines/${id}/pay`); toast.success('Fine paid!'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;
  const unpaid = fines.filter(f => !f.isPaid);
  const paid = fines.filter(f => f.isPaid);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">My Fines</h1>
      {unpaid.length > 0 && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-red-400 font-medium">You have {unpaid.length} unpaid fine(s) totalling ₹{unpaid.reduce((sum, f) => sum + f.amount, 0).toFixed(2)}</p></div>}
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Amount</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Date</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th></tr></thead>
          <tbody>{fines.map((f) => (
            <tr key={f.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4 text-gray-200">{f.circulation?.book?.title || 'N/A'}</td><td className="p-4 font-semibold text-gray-200">₹{f.amount.toFixed(2)}</td><td className="p-4"><span className={`badge ${f.isPaid ? 'badge-success' : 'badge-danger'}`}>{f.isPaid ? 'Paid' : 'Unpaid'}</span></td><td className="p-4 text-sm text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</td><td className="p-4 text-right">{!f.isPaid && <button onClick={() => handlePay(f.id)} className="btn-primary text-sm !px-4 !py-1.5">Pay</button>}</td></tr>
          ))}{fines.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No fines. 🎉</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
