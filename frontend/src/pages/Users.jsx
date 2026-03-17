import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { UserPlus } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', isAdmin: false });

  const fetchData = async () => { try { const { data } = await api.get('/users/all'); setUsers(data.data || data); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = form.isAdmin ? '/users/add-admin' : '/users/add-user';
      await api.post(endpoint, { name: form.name, email: form.email, password: form.password });
      toast.success('User created!');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', isAdmin: false });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-100">Manage Users</h1><p className="text-gray-500 mt-1">{users.length} registered users</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add User</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input className="input-field" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isAdmin" checked={form.isAdmin} onChange={e => setForm({...form, isAdmin: e.target.checked})} className="w-4 h-4 accent-emerald-500" />
            <label htmlFor="isAdmin" className="text-sm text-gray-400">Create as Admin</label>
            <button type="submit" className="btn-primary text-sm ml-auto">Create</button>
          </div>
        </form>
      )}
      <div className="glass-card overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-gray-800/50"><th className="text-left p-4 text-sm font-semibold text-gray-400">Name</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Email</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Role</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Fine Balance</th><th className="text-left p-4 text-sm font-semibold text-gray-400">Joined</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"><td className="p-4 font-medium text-gray-200">{u.name}</td><td className="p-4 text-sm text-gray-400">{u.email}</td><td className="p-4"><span className={`badge ${u.role === 'ADMIN' ? 'badge-info' : 'badge-neutral'}`}>{u.role}</span></td><td className="p-4 text-sm text-gray-400">{u.fineBalance > 0 ? <span className="text-red-400">₹{u.fineBalance?.toFixed(2)}</span> : '₹0.00'}</td><td className="p-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td></tr>
          ))}</tbody></table>
      </div>
    </div>
  );
}
