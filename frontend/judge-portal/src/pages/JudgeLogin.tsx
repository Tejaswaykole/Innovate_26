import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/client';
import { useNavigate } from 'react-router-dom';

export default function JudgeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ProtectedRoute will handle role verification after login
      navigate('/judge/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-outline-variant">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary mb-2">Judge Portal</h1>
          <p className="text-secondary font-medium">Please sign in to continue</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="judge@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
