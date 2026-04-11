import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { X, Star, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function ReviewsModal({ book, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useSelector((state) => state.auth);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/book/${book.id}`);
      setReviews(res.data.data);
      setAvgRating(res.data.avgRating);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [book.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { bookId: book.id, rating: newRating, comment: newComment });
      toast.success('Review posted successfully!');
      setNewComment('');
      setNewRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col mx-4 border border-gray-800">
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-950/50">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Reviews: {book.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-400">{avgRating.toFixed(1)} / 5.0 ({reviews.length} reviews)</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Post Review Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <h3 className="font-medium text-gray-200 mb-3 text-sm">Write a Review</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex text-lg">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-6 h-6 cursor-pointer ${s <= newRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
                    onClick={() => setNewRating(s)}
                  />
                ))}
              </div>
            </div>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 mb-3"
              rows={3}
              placeholder="What did you think about this book?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={submitting}
              className="px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-500 transition-all disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </form>

          {/* List Reviews */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No reviews yet. Be the first!</div>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="bg-gray-800/20 p-4 rounded-xl border border-gray-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {rev.user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-sm text-gray-200 block">{rev.user.name}</span>
                        <div className="flex text-yellow-500">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-yellow-500' : 'text-gray-700 fill-transparent'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    {(user.id === rev.userId || user.role === 'ADMIN') && (
                      <button onClick={() => handleDelete(rev.id)} className="text-gray-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {rev.comment && <p className="text-sm text-gray-400 mt-2">{rev.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
