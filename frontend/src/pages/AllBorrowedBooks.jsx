import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { Undo2 } from 'lucide-react';

export default function AllBorrowedBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => { try { const { data } = await api.get('/circulation/all'); setRecords(data.data || data); } catch { toast.error('Failed to load'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const handleAdminReturn = async (id) => { try { await api.put(`/circulation/admin-return/${id}`); toast.success('Book returned!'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">All Active Borrows</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th><th className="text-left p-4 text-sm font-semibold text-gray-400">User</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Borrowed</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Due</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th><th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th></tr></thead>
          <tbody>{records.map((c) => (
            <tr key={c.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4"><p className="font-medium text-gray-200">{c.book?.title}</p></td><td className="p-4 text-sm text-gray-400">{c.user?.name} ({c.user?.email})</td><td className="p-4 text-sm text-gray-400">{new Date(c.borrowDate).toLocaleDateString()}</td><td className="p-4 text-sm text-gray-400">{c.dueDate ? new Date(c.dueDate).toLocaleDateString() : 'N/A'}</td><td className="p-4">{c.dueDate && new Date(c.dueDate) < new Date() ? <span className="badge badge-danger">Overdue</span> : <span className="badge badge-success">Active</span>}</td><td className="p-4 text-right"><button onClick={() => handleAdminReturn(c.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"><Undo2 className="w-3.5 h-3.5" /> Return</button></td></tr>
          ))}{records.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">No active borrows.</td></tr>}</tbody></table>
      </div>
    </div>
  );
}
