import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ThumbsUp, Plus } from 'lucide-react';

export default function BookSuggestions() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => { try { const { data } = await api.get('/suggestions/all'); setSuggestions(data.data || data); } catch { toast.error('Failed'); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleVote = async (id) => { try { const { data } = await api.post(`/suggestions/vote/${id}`); toast.success(data.data.voted ? 'Voted!' : 'Vote removed'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const handleApprove = async (id) => { try { await api.post(`/suggestions/approve/${id}`); toast.success('Approved!'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const handleReject = async (id) => { try { await api.post(`/suggestions/reject/${id}`); toast.success('Rejected'); fetchData(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Book Suggestions</h1>
        <Link to="/suggestions/new" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Suggest a Book</Link>
      </div>
      <div className="grid gap-4">
        {suggestions.map(s => (
          <div key={s.id} className="glass-card p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-200">{s.title}</h3>
                <p className="text-sm text-gray-500">by {s.author} • {s.category}</p>
                <p className="text-sm text-gray-400 mt-2">{s.description}</p>
                <p className="text-xs text-gray-600 mt-2">Suggested by {s.suggestedBy?.name}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={() => handleVote(s.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${s.votes?.some(v => v.userId === user?.id) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'}`}>
                  <ThumbsUp className="w-4 h-4" /> {s.voteCount}
                </button>
                <span className={`badge ${s.status === 'PENDING' ? 'badge-warning' : s.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
              </div>
            </div>
            {isAdmin && s.status === 'PENDING' && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800/30">
                <button onClick={() => handleApprove(s.id)} className="btn-primary text-sm !px-4 !py-1.5">Approve</button>
                <button onClick={() => handleReject(s.id)} className="btn-danger text-sm !px-4 !py-1.5">Reject</button>
              </div>
            )}
          </div>
        ))}
        {suggestions.length === 0 && <div className="text-center py-12 text-gray-500">No suggestions yet. Be the first to suggest a book!</div>}
      </div>
    </div>
  );
}
