'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); }
    else router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#1a6b3c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/40">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Khadi India Healthcare</h1>
          <p className="text-slate-400 text-sm mt-1">Admin — Inventory & Leads Management</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
                placeholder="admin@khadiindiahealthcare.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] pr-10"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#1a6b3c] hover:bg-[#155730] disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-600 mt-6">Access restricted to authorized personnel only.</p>
      </div>
    </div>
  );
}
