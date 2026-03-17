import { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart3, BookOpen, Users, DollarSign, Clock, Layers } from 'lucide-react';

export default function Reports() {
  const [tab, setTab] = useState('stats');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: 'stats', label: 'Library Stats', icon: BarChart3, endpoint: '/reports/library-stats' },
    { key: 'popular', label: 'Popular Books', icon: BookOpen, endpoint: '/reports/popular-books' },
    { key: 'activity', label: 'User Activity', icon: Users, endpoint: '/reports/user-activity' },
    { key: 'financial', label: 'Financial', icon: DollarSign, endpoint: '/reports/financial' },
    { key: 'overdue', label: 'Overdue', icon: Clock, endpoint: '/reports/overdue' },
    { key: 'category', label: 'By Category', icon: Layers, endpoint: '/reports/category' },
  ];

  useEffect(() => {
    setLoading(true);
    const ep = tabs.find(t => t.key === tab)?.endpoint;
    if (ep) api.get(ep).then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Reports</h1>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800/30 text-gray-400 hover:bg-gray-800/50'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>
      <div className="glass-card p-6">
        {loading ? <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /></div> : (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
