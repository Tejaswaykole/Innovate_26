import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase/client';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLoginHackathonosPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, role, loading: authLoading, logout } = useAuth();

  // If already authenticated and profile loaded, handle redirect
  useEffect(() => {
    if (!authLoading && currentUser) {
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'participant' || role === 'judge') {
        // Automatically logout non-admins who try to use this page
        logout().then(() => {
          setError('Unauthorized access. Only administrators can login here.');
        });
      }
    }
  }, [currentUser, role, authLoading, navigate, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirection or rejection once AuthContext updates
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-900">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[80px] animate-pulse"></div>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

      <main className="w-full max-w-md relative z-10 transition-all duration-500 transform translate-y-0 opacity-100">
        {/* Glassmorphism Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-500"></div>

          <header className="pt-10 px-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 shadow-lg rounded-2xl bg-white p-2">
              <img src="/logo.png" alt="Innovative'26 Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">INNOVATIVE'26 Pro</h1>
            <h2 className="text-sm text-primary tracking-[0.2em] uppercase font-medium">Admin Portal</h2>
          </header>

          <section className="px-8 pb-10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-red-400 text-[20px]" data-icon="error">error</span>
                <p className="text-red-400 font-body-sm text-sm leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label className="block text-xs font-medium text-slate-300 group-focus-within:text-primary transition-colors" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary text-[20px]" data-icon="mail">mail</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-4 py-3.5 font-body-md text-white bg-white/5 border border-white/10 rounded-xl placeholder-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 outline-none backdrop-blur-sm"
                    id="email"
                    name="email"
                    placeholder="admin@INNOVATIVE'26.io"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-xs font-medium text-slate-300 group-focus-within:text-primary transition-colors" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <span className="material-symbols-outlined text-slate-500 group-focus-within:text-primary text-[20px]" data-icon="lock">lock</span>
                  </div>
                  <input
                    className="block w-full pl-11 pr-11 py-3.5 font-body-md text-white bg-white/5 border border-white/10 rounded-xl placeholder-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 outline-none backdrop-blur-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-[20px]" data-icon={showPassword ? 'visibility_off' : 'visibility'}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="relative w-full flex justify-center items-center py-3.5 px-6 border border-transparent rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-slate-900 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-blue-600 group-hover:opacity-90 transition-opacity"></div>
                  
                  <div className="relative flex items-center text-white font-medium tracking-wide">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    ) : (
                      <span className="material-symbols-outlined mr-2 text-[20px]" data-icon="login">login</span>
                    )}
                    {isLoading ? 'Authenticating...' : 'Secure Login'}
                  </div>
                </button>
              </div>
            </form>
          </section>

          <footer className="bg-white/[0.02] py-4 px-8 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary/70" data-icon="shield">shield</span>
              Unauthorized access is strictly prohibited.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
