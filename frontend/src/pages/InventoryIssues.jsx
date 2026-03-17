import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AlertTriangle, Check, Plus } from 'lucide-react';

export default function InventoryIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookId: '', status: 'MISSING', note: '' });

  const fetchData = async () => { try { const { data } = await api.get('/inventory'); setIssues(data.data || data); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/inventory', form); toast.success('Issue reported!'); setShowForm(false); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleResolve = async (id) => { try { await api.put(`/inventory/resolve/${id}`); toast.success('Resolved!'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Inventory Issues</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Report Issue</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input className="input-field" placeholder="Book ID" value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})} required />
            <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="MISSING">Missing</option><option value="STOLEN">Stolen</option></select>
            <input className="input-field" placeholder="Note" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary text-sm">Submit</button>
        </form>
      )}
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Reported By</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Note</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th></tr></thead>
          <tbody>{issues.map(i => (
            <tr key={i.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4 text-gray-200">{i.book?.title || i.bookId}</td><td className="p-4"><span className={`badge ${i.status === 'STOLEN' ? 'badge-danger' : 'badge-warning'}`}>{i.status}</span></td><td className="p-4 text-sm text-gray-400">{i.reportedBy?.name}</td><td className="p-4 text-sm text-gray-500">{i.note}</td><td className="p-4">{i.resolved ? <span className="badge badge-success">Resolved</span> : <span className="badge badge-warning">Open</span>}</td><td className="p-4 text-right">{!i.resolved && <button onClick={() => handleResolve(i.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"><Check className="w-3.5 h-3.5" /> Resolve</button>}</td></tr>
          ))}{issues.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No inventory issues.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
