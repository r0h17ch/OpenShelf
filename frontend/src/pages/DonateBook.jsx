import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function DonateBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', isbn: '', publicationYear: '', genre: '', condition: 'GOOD', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/donations/request', { ...form, publicationYear: form.publicationYear ? parseInt(form.publicationYear) : null }); toast.success('Donation request submitted!'); navigate('/donations'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Donate a Book</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Title *</label><input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Author *</label><input className="input-field" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm text-gray-400 mb-1">ISBN</label><input className="input-field" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Year</label><input type="number" className="input-field" value={form.publicationYear} onChange={e => setForm({...form, publicationYear: e.target.value})} /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Genre</label><input className="input-field" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Condition</label><select className="input-field" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}><option value="EXCELLENT">Excellent</option><option value="GOOD">Good</option><option value="FAIR">Fair</option><option value="POOR">Poor</option></select></div>
        </div>
        <div><label className="block text-sm text-gray-400 mb-1">Description</label><textarea className="input-field h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Donation Request'}</button><button type="button" onClick={() => navigate('/donations')} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
