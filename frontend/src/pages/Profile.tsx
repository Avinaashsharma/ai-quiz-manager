import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, logout, updateName } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim() || name.trim() === user?.name) return;
    setSaving(true); setError(''); setMsg('');
    try {
      await updateName(name.trim());
      setMsg('Name updated successfully!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to update name');
    } finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <div className="min-h-[calc(100vh-56px)] relative flex items-center justify-center px-4 py-8 overflow-hidden bg-orange-50">

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-orange-300/30 blur-[100px] -top-32 -left-32 animate-float" style={{animationDuration:'8s'}}/>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-300/20 blur-[80px] top-1/2 -right-32 animate-float-reverse" style={{animationDuration:'10s'}}/>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-orange-200/40 blur-[60px] -bottom-20 left-1/3 animate-float" style={{animationDuration:'7s'}}/>
        <div className="absolute w-[200px] h-[200px] rounded-full bg-yellow-200/30 blur-[50px] top-[20%] left-1/2 animate-float-reverse" style={{animationDuration:'6s'}}/>

        {/* Floating study material elements */}
        <span className="absolute top-[8%] left-[8%] text-orange-400/30 text-xl font-mono font-bold animate-float select-none" style={{animationDuration:'5s'}}>E = mc²</span>
        <span className="absolute top-[18%] right-[10%] text-amber-500/25 text-lg font-mono animate-float-reverse select-none" style={{animationDuration:'6s'}}>π = 3.14</span>
        <span className="absolute top-[35%] left-[5%] text-orange-500/30 text-2xl font-bold animate-float select-none" style={{animationDuration:'4s'}}>A+</span>
        <span className="absolute top-[12%] left-[40%] text-orange-400/20 text-sm font-mono animate-float-reverse select-none" style={{animationDuration:'7s'}}>∑(xᵢ)</span>
        <span className="absolute bottom-[30%] left-[7%] text-orange-400/25 text-base font-mono animate-float-reverse select-none" style={{animationDuration:'5.5s'}}>H₂O</span>
        <span className="absolute bottom-[15%] right-[8%] text-amber-500/30 text-xl font-bold animate-float select-none" style={{animationDuration:'4.5s'}}>100%</span>
        <span className="absolute top-[55%] right-[12%] text-orange-400/25 text-sm font-mono animate-float-reverse select-none" style={{animationDuration:'6.5s'}}>F = ma</span>
        <span className="absolute bottom-[8%] left-[30%] text-orange-400/20 text-lg font-mono animate-float select-none" style={{animationDuration:'5s'}}>√x + y²</span>
        <span className="absolute top-[72%] left-[18%] text-orange-500/25 text-base font-bold animate-float-reverse select-none" style={{animationDuration:'7s'}}>✓ Quiz</span>
        <span className="absolute top-[25%] left-[22%] text-orange-400/20 text-sm font-mono animate-float select-none" style={{animationDuration:'4s'}}>CO₂</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-[0_8px_32px_rgba(249,115,22,0.3)] mb-4">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          <span className="mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
            {user?.role}
          </span>
        </div>

        {/* Glass card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setMsg(''); setError(''); }}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
            />
          </div>

          {msg && (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 border border-green-400/20 px-3 py-2 rounded-lg">
              <span>✓</span>{msg}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
              <span>✕</span>{error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || name.trim() === user?.name}
            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-gray-50 border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-500 rounded-xl text-sm font-medium transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
