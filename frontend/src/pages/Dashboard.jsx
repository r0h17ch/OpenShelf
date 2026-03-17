import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { BookOpen, Users, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = isAdmin
          ? await api.get('/reports/library-stats')
          : await api.get('/circulation/my');
        setStats(isAdmin ? data.data : { circulations: data.data || data });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally { setLoading(false); }
    };
    fetchStats();
  }, [isAdmin]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div>;

  const statCards = isAdmin && stats ? [
    { icon: BookOpen, label: 'Total Books', value: stats.books?.total || 0, color: 'emerald', sub: `${stats.books?.available || 0} available` },
    { icon: Users, label: 'Total Users', value: stats.users?.total || 0, color: 'cyan', sub: `${stats.users?.admins || 0} admins` },
    { icon: Clock, label: 'Active Borrows', value: stats.borrows?.active || 0, color: 'amber', sub: `${stats.borrows?.overdue || 0} overdue` },
    { icon: DollarSign, label: 'Unpaid Fines', value: `₹${stats.fines?.unpaidFines || 0}`, color: 'red', sub: `₹${stats.fines?.paidFines || 0} paid` },
  ] : [];

  const userBorrows = !isAdmin && stats?.circulations ? stats.circulations.filter(c => !c.returnDate) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Welcome back, <span className="gradient-text">{user?.name}</span></h1>
        <p className="text-gray-500 mt-1">{isAdmin ? 'Library administration overview' : 'Your library activity'}</p>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="glass-card p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-100">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
              <p className="text-xs text-gray-600 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Currently Borrowed ({userBorrows.length})</h2>
          {userBorrows.length === 0 ? (
            <p className="text-gray-500">No books currently borrowed. Visit the <a href="/books" className="text-emerald-400 hover:underline">library</a> to borrow a book.</p>
          ) : (
            <div className="space-y-3">
              {userBorrows.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-200">{c.book?.title}</p>
                    <p className="text-sm text-gray-500">{c.book?.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Due: {c.dueDate ? new Date(c.dueDate).toLocaleDateString() : 'N/A'}</p>
                    {c.dueDate && new Date(c.dueDate) < new Date() && (
                      <span className="badge badge-danger mt-1 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
