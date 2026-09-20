import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOtp: verifyOtpFn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as { email?: string })?.email || '';

  // If no email in state, redirect to register
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const dest = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtpFn(email, otpString);
      // Navigation handled by useEffect after user state updates
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-purple-300 text-sm">
            We&apos;ve sent a 6-digit code to
          </p>
          <p className="text-white font-semibold text-sm mt-1">{email}</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors duration-200"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="text-center text-purple-300 mt-6 text-xs">
          Code expires in 10 minutes
        </p>

        <Link to="/register" className="block text-center text-white/50 hover:text-white/80 mt-4 text-sm">
          ← Back to Register
        </Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
