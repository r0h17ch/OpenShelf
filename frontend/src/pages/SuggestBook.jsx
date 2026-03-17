import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function SuggestBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', author: '', description: '', isbn: '', category: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/suggestions', form); toast.success('Suggestion submitted!'); navigate('/suggestions'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Suggest a Book</h1>
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div><label className="block text-sm text-gray-400 mb-1">Title *</label><input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Author *</label><input className="input-field" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Category *</label><input className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required placeholder="e.g. Computer Science" /></div>
        <div><label className="block text-sm text-gray-400 mb-1">ISBN</label><input className="input-field" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Why should we add this book? *</label><textarea className="input-field h-24 resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
        <div className="flex gap-3"><button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Suggestion'}</button><button type="button" onClick={() => navigate('/suggestions')} className="btn-secondary">Cancel</button></div>
      </form>
    </div>
  );
}
