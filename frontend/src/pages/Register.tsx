import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useAuth();
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

    if (!name || !email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(name, email, password, role);
      if (result.requiresVerification) {
        // Redirect to OTP verification page
        navigate('/verify-otp', { state: { email: result.email } });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Select Role"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
          >
            <option value="" disabled className="text-gray-900">Select Role</option>
            <option value="teacher" className="text-gray-900">Teacher</option>
            <option value="student" className="text-gray-900">Student</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors duration-200"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-purple-300 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 underline">
            Login
          </Link>
        </p>
        <Link to="/" className="block text-center text-white/50 hover:text-white/80 mt-4 text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
