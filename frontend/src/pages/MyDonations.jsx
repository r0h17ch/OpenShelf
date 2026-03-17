import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Gift, Plus } from 'lucide-react';

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/donations/my').then(r => setDonations(r.data.data || r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;
  const statusColors = { PENDING: 'badge-warning', APPROVED: 'badge-info', REJECTED: 'badge-danger', COMPLETED: 'badge-success' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">My Donations</h1>
        <Link to="/donations/new" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Donate a Book</Link>
      </div>
      <div className="grid gap-4">
        {donations.map(d => (
          <div key={d.id} className="glass-card p-5 card-hover flex items-center justify-between">
            <div className="flex items-center gap-4"><Gift className="w-8 h-8 text-emerald-400/50" /><div><h3 className="font-semibold text-gray-200">{d.title}</h3><p className="text-sm text-gray-500">by {d.author} • {d.condition}</p></div></div>
            <div className="text-right"><span className={`badge ${statusColors[d.status]}`}>{d.status}</span><p className="text-xs text-gray-600 mt-1">{new Date(d.createdAt).toLocaleDateString()}</p></div>
          </div>
        ))}
        {donations.length === 0 && <div className="text-center py-12 text-gray-500">No donation requests yet.</div>}
      </div>
    </div>
  );
}
