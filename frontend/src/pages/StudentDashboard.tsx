import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface AttemptSummary {
  _id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  quiz: { _id: string; title: string; description: string };
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts');
        setAttempts(res.data.data.attempts);
      } catch { /* Dashboard still usable */ } finally { setIsLoading(false); }
    };
    fetchAttempts();
  }, []);

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) : 0;

  const scoreColor = (pct: number) =>
    pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">Your quiz activity at a glance</p>
          </div>
          <Link to="/student/join" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Join Quiz
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Quizzes Taken</p>
            <p className="text-3xl font-bold text-gray-900">{attempts.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Avg. Score</p>
            <p className="text-3xl font-bold text-gray-900">{avgScore}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">Best Score</p>
            <p className="text-3xl font-bold text-green-600">
              {attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0}%
            </p>
          </div>
        </div>

        {/* Recent Attempts */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attempts</h2>
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : attempts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t taken any quizzes yet.</p>
            <Link to="/student/join" className="inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              Join Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt) => (
              <Link
                key={attempt._id}
                to={`/student/results/${attempt._id}`}
                className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{attempt.quiz.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {attempt.score}/{attempt.totalQuestions} correct · {new Date(attempt.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-2xl font-bold ${scoreColor(attempt.percentage)}`}>
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
