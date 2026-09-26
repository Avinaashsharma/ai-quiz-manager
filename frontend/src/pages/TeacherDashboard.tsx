import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface QuizSummary {
  _id: string;
  title: string;
  status: string;
  joinCode: string;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data.data.quizzes);
      } catch { /* Dashboard still usable */ } finally { setIsLoading(false); }
    };
    fetchQuizzes();
  }, []);

  const activeCount = quizzes.filter((q) => q.status === 'active').length;
  const draftCount = quizzes.filter((q) => q.status === 'draft').length;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s an overview of your quizzes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Total Quizzes</p>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : quizzes.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : activeCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Drafts</p>
            <p className="text-3xl font-bold text-orange-500">{isLoading ? '...' : draftCount}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {quizzes.length === 0 ? 'Create your first quiz to get started.' : 'Create a new quiz or manage existing ones.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/teacher/quizzes/create"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              + Create Quiz
            </Link>
            {quizzes.length > 0 && (
              <Link
                to="/teacher/quizzes"
                className="px-6 py-2.5 bg-white hover:bg-orange-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors"
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
