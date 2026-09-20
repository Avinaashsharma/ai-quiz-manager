import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface AttemptSummary {
  _id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  quiz: {
    _id: string;
    title: string;
    description: string;
  };
}

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts');
        setAttempts(res.data.data.attempts);
      } catch {
        // Silently fail — dashboard still usable
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>
            <p className="text-purple-300 mt-1">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/student/join"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition-colors"
            >
              Join Quiz
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Quizzes Taken</h3>
            <p className="text-4xl font-bold">{attempts.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Avg. Score</h3>
            <p className="text-4xl font-bold">{avgScore}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Best Score</h3>
            <p className="text-4xl font-bold">
              {attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0}%
            </p>
          </div>
        </div>

        {/* Recent Attempts */}
        <h2 className="text-xl font-semibold mb-4">Recent Attempts</h2>
        {isLoading ? (
          <p className="text-purple-300">Loading...</p>
        ) : attempts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-purple-200 text-lg mb-4">You haven&apos;t taken any quizzes yet.</p>
            <Link
              to="/student/join"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
            >
              Join Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => (
              <Link
                key={attempt._id}
                to={`/student/results/${attempt._id}`}
                className="block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{attempt.quiz.title}</h3>
                    <p className="text-purple-400 text-sm">
                      {attempt.score}/{attempt.totalQuestions} correct •{' '}
                      {new Date(attempt.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-2xl font-bold ${
                      attempt.percentage >= 80
                        ? 'text-green-400'
                        : attempt.percentage >= 50
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {attempt.percentage}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
