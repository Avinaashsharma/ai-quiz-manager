import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      const dest = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || 'Login failed';

        if (status === 403 && message.includes('verify')) {
          navigate('/verify-otp', { state: { email } });
          return;
        }

        setError(message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-br from-orange-50/80 via-white to-amber-50/60 px-4 py-8 relative overflow-hidden">
      {/* Background Floating Quiz / Study Icons */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl" />
        <div className="absolute opacity-35 top-[7%] left-[8%] animate-float text-3xl sm:text-4xl" style={{ animationDuration: '4.2s' }}>📚</div>
        <div className="absolute opacity-35 top-[14%] right-[10%] animate-float-reverse text-4xl sm:text-5xl" style={{ animationDuration: '5.2s' }}>✨</div>
        <div className="absolute opacity-35 bottom-[16%] left-[7%] animate-float text-3xl sm:text-4xl" style={{ animationDuration: '3.8s' }}>🎓</div>
        <div className="absolute opacity-35 bottom-[12%] right-[12%] animate-float-reverse text-4xl sm:text-5xl" style={{ animationDuration: '4.6s' }}>🏆</div>
        <div className="absolute opacity-35 top-[45%] left-[5%] animate-float-reverse text-2xl sm:text-3xl" style={{ animationDuration: '4.8s' }}>✏️</div>
        <div className="absolute opacity-35 top-[32%] right-[6%] animate-float text-2xl sm:text-3xl" style={{ animationDuration: '3.4s' }}>💡</div>
        <div className="absolute opacity-35 bottom-[35%] right-[25%] animate-float-reverse text-3xl sm:text-4xl" style={{ animationDuration: '4.1s' }}>❓</div>
        <div className="absolute opacity-35 top-[60%] left-[18%] animate-float text-2xl sm:text-3xl" style={{ animationDuration: '3.9s' }}>🧠</div>
        <div className="absolute opacity-35 top-[4%] left-[45%] animate-float-reverse text-3xl sm:text-4xl" style={{ animationDuration: '4.4s' }}>⭐</div>
        <div className="absolute opacity-35 bottom-[6%] left-[36%] animate-float text-2xl sm:text-3xl" style={{ animationDuration: '3.6s' }}>🎯</div>
        <div className="absolute opacity-35 bottom-[52%] right-[4%] animate-float text-2xl sm:text-3xl" style={{ animationDuration: '4.5s' }}>📋</div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl p-7 sm:p-9 w-full max-w-[420px] shadow-xl shadow-orange-500/5 relative z-10 overflow-hidden">
        {/* Top gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        <div className="text-center mb-6">
          <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-orange-500/25">
            <span className="text-2xl font-black leading-none">◆</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Sign in to your AI Quiz Manager account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/90 text-red-700 px-4 py-2.5 rounded-xl mb-5 text-xs sm:text-sm font-medium flex items-center gap-2.5">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs sm:text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1 transition-colors">
            Create account
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
