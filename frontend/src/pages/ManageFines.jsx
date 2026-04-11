import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function ManageFines() {
  const [data, setData] = useState({ fines: [], usersWithFines: [] });
  const [loading, setLoading] = useState(true);
  const fetchData = async () => { try { const { data } = await api.get('/fines/all'); setData(data.data || data); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const markPaid = async (id) => { try { await api.put(`/fines/mark-paid/${id}`); toast.success('Marked as paid'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const haltFine = async (circulationId) => { try { await api.put(`/fines/halt/${circulationId}`); toast.success('Fine halted successfully'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Manage Fines</h1>
      {data.usersWithFines?.length > 0 && <div className="glass-card p-4"><h2 className="text-lg font-semibold text-gray-300 mb-3">Users with Outstanding Fines</h2><div className="space-y-2">{data.usersWithFines.map(u => <div key={u.id} className="flex justify-between p-3 bg-gray-800/30 rounded-xl"><span className="text-gray-300">{u.name} ({u.email})</span><span className="text-red-400 font-semibold">₹{u.fineBalance?.toFixed(2)}</span></div>)}</div></div>}
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">User</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Amount</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th></tr></thead>
          <tbody>{(data.fines || []).map((f) => (
            <tr key={f.id} className="border-b border-gray-800/30">
              <td className="p-4 text-gray-300">{f.circulation?.user?.name || 'N/A'}</td>
              <td className="p-4 text-gray-300">{f.circulation?.book?.title || 'N/A'}</td>
              <td className="p-4 font-semibold text-gray-200">
                ₹{f.amount?.toFixed(2)}
                {f.circulation?.fineHalted && <span className="ml-2 inline-flex items-center font-medium bg-orange-500/10 text-orange-400 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/20">Halted</span>}
              </td>
              <td className="p-4"><span className={`badge ${f.isPaid ? 'badge-success' : 'badge-danger'}`}>{f.isPaid ? 'Paid' : 'Unpaid'}</span></td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {!f.isPaid && <button onClick={() => markPaid(f.id)} className="btn-primary text-sm !px-4 !py-1.5">Mark Paid</button>}
                  {!f.isPaid && !f.circulation?.fineHalted && <button onClick={() => haltFine(f.circulation.id)} className="btn-secondary text-sm !px-4 !py-1.5 border-orange-500/50 text-orange-400 hover:bg-orange-500/10">Halt Fine</button>}
                </div>
              </td>
            </tr>
          ))}</tbody></table>
      </div>
    </div>
  );
}
