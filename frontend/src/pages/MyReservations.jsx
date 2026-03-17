import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { X } from 'lucide-react';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => { try { const { data } = await api.get('/reservations/my'); setReservations(data.data || data); } catch { toast.error('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const handleCancel = async (id) => { try { await api.delete(`/reservations/${id}`); toast.success('Reservation cancelled'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">My Reservations</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Position</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Created</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th></tr></thead>
          <tbody>{reservations.map((r) => (
            <tr key={r.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4 font-medium text-gray-200">{r.book?.title}</td><td className="p-4 text-gray-400">#{r.position}</td><td className="p-4"><span className={`badge ${r.status === 'PENDING' ? 'badge-warning' : r.status === 'FULFILLED' ? 'badge-success' : 'badge-neutral'}`}>{r.status}</span></td><td className="p-4 text-sm text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td><td className="p-4 text-right">{r.status === 'PENDING' && <button onClick={() => handleCancel(r.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"><X className="w-3.5 h-3.5" /> Cancel</button>}</td></tr>
          ))}{reservations.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No reservations.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
