import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface QuizSummary {
  _id: string;
  title: string;
  status: string;
  joinCode: string;
}

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data.data.quizzes);
      } catch {
        // Dashboard still usable without data
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const activeCount = quizzes.filter((q) => q.status === 'active').length;
  const draftCount = quizzes.filter((q) => q.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">📚 Teacher Dashboard</h1>
            <p className="text-purple-300 mt-1">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/teacher/quizzes"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition-colors"
            >
              My Quizzes
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
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Total Quizzes</h3>
            <p className="text-4xl font-bold">{isLoading ? '...' : quizzes.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Active</h3>
            <p className="text-4xl font-bold text-green-400">{isLoading ? '...' : activeCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-1">Drafts</h3>
            <p className="text-4xl font-bold text-yellow-400">{isLoading ? '...' : draftCount}</p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-purple-200 text-lg mb-4">
            {quizzes.length === 0 ? 'Start by creating quizzes for your students.' : 'Create a new quiz or manage your existing ones.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/teacher/quizzes/create"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
            >
              + Create New Quiz
            </Link>
            {quizzes.length > 0 && (
              <Link
                to="/teacher/quizzes"
                className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors"
              >
                View All Quizzes
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
