import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { fetchMe } from '../store/slices/authSlice';
import { User, Mail, Phone, MapPin, Shield, Crown } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });

  const handleSave = async () => {
    try {
      await api.put('/users/update-profile', form);
      toast.success('Profile updated!');
      dispatch(fetchMe());
      setEditing(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Profile</h1>
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-info' : 'badge-neutral'}`}><Shield className="w-3 h-3 mr-1 inline" />{user?.role}</span>
              {user?.isPremium && <span className="badge badge-warning"><Crown className="w-3 h-3 mr-1 inline" />Premium</span>}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl"><Mail className="w-4 h-4 text-gray-500" /><span className="text-gray-300">{user?.email}</span></div>
          {editing ? (
            <>
              <div><label className="block text-sm text-gray-400 mb-1">Name</label><input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div><label className="block text-sm text-gray-400 mb-1">Address</label><input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="flex gap-3"><button onClick={handleSave} className="btn-primary">Save</button><button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl"><Phone className="w-4 h-4 text-gray-500" /><span className="text-gray-300">{user?.phone || 'Not set'}</span></div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl"><MapPin className="w-4 h-4 text-gray-500" /><span className="text-gray-300">{user?.address || 'Not set'}</span></div>
              <button onClick={() => setEditing(true)} className="btn-secondary w-full">Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
