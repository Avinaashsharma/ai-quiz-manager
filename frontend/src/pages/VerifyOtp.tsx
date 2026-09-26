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

  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (user) {
      const dest = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
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
    if (otpString.length !== 6) { setError('Please enter the complete 6-digit code'); return; }

    setIsVerifying(true);
    try {
      await verifyOtpFn(email, otpString);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-orange-50 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-500 text-xl">✉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h2>
          <p className="text-gray-500 text-sm">We sent a 6-digit code to</p>
          <p className="text-gray-900 font-medium text-sm mt-1">{email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
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
                className="w-11 h-13 text-center text-xl font-bold rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-xs">Code expires in 10 minutes</p>
        <Link to="/register" className="block text-center text-gray-500 hover:text-gray-700 mt-3 text-sm">← Back to Register</Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
