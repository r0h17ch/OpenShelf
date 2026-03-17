import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function ManageDonations() {
  const [data, setData] = useState({ donations: [] });
  const [loading, setLoading] = useState(true);
  const fetchData = async () => { try { const { data } = await api.get('/donations/all'); setData(data.data || data); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const action = async (id, act) => { try { await api.put(`/donations/${act}/${id}`); toast.success(`Donation ${act}d!`); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const statusColors = { PENDING: 'badge-warning', APPROVED: 'badge-info', REJECTED: 'badge-danger', COMPLETED: 'badge-success' };
  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Manage Donations</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Donor</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Condition</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th></tr></thead>
          <tbody>{(data.donations || []).map(d => (
            <tr key={d.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition">
              <td className="p-4"><p className="font-medium text-gray-200">{d.title}</p><p className="text-sm text-gray-500">{d.author}</p></td>
              <td className="p-4 text-sm text-gray-400">{d.user?.name}</td>
              <td className="p-4"><span className="badge badge-neutral">{d.condition}</span></td>
              <td className="p-4"><span className={`badge ${statusColors[d.status]}`}>{d.status}</span></td>
              <td className="p-4 text-right space-x-2">
                {d.status === 'PENDING' && <><button onClick={() => action(d.id, 'approve')} className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition">Approve</button><button onClick={() => action(d.id, 'reject')} className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">Reject</button></>}
                {d.status === 'APPROVED' && <button onClick={() => action(d.id, 'complete')} className="btn-primary text-sm !px-4 !py-1.5">Complete</button>}
              </td>
            </tr>
          ))}{(data.donations || []).length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No donations.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
