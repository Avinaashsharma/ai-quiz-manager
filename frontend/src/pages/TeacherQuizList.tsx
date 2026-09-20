import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import axios from 'axios';

interface QuizSummary {
  _id: string;
  title: string;
  description: string;
  duration: number;
  joinCode: string;
  status: string;
  createdAt: string;
}

const TeacherQuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/quizzes');
      setQuizzes(res.data.data.quizzes);
      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to load quizzes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    setDeleteId(id);
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete quiz');
      }
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">📚 My Quizzes</h1>
            <p className="text-purple-300 mt-1">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} total</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/teacher/dashboard"
              className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/teacher/quizzes/create"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-sm font-semibold transition-colors"
            >
              + Create Quiz
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-purple-300 py-20 text-lg">Loading quizzes...</div>
        )}

        {/* Empty State */}
        {!isLoading && quizzes.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-purple-200 text-lg mb-4">You haven&apos;t created any quizzes yet.</p>
            <Link
              to="/teacher/quizzes/create"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
            >
              Create Your First Quiz
            </Link>
          </div>
        )}

        {/* Quiz Cards */}
        {!isLoading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white leading-tight flex-1 mr-2">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-lg border font-medium shrink-0 ${statusColor(quiz.status)}`}>
                      {quiz.status}
                    </span>
                  </div>
                  {quiz.description && (
                    <p className="text-purple-300 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-purple-400 mb-4">
                    <span>⏱ {quiz.duration} min</span>
                    <span className="font-mono bg-white/5 px-2 py-0.5 rounded">#{quiz.joinCode}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link
                    to={`/teacher/quizzes/${quiz._id}/edit`}
                    className="flex-1 text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/teacher/quizzes/${quiz._id}/results`}
                    className="flex-1 text-center py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Results
                  </Link>
                  <Link
                    to={`/teacher/quizzes/${quiz._id}/analytics`}
                    className="flex-1 text-center py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    📊 Analytics
                  </Link>
                  {quiz.status === 'active' && (
                    <Link
                      to={`/teacher/live/${quiz.joinCode}`}
                      className="flex-1 text-center py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      🔴 Live
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    disabled={deleteId === quiz._id}
                    className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleteId === quiz._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuizList;
