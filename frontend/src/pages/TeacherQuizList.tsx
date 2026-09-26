import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

interface QuizSummary {
  _id: string; title: string; description: string; duration: number; joinCode: string; status: string; createdAt: string;
}

const TeacherQuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/quizzes');
      setQuizzes(res.data.data.quizzes);
      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to load quizzes');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    setDeleteId(id);
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to delete quiz');
    } finally { setDeleteId(null); }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-500 text-sm mt-1">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}</p>
          </div>
          <Link to="/teacher/quizzes/create" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors">
            + Create Quiz
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>
        )}

        {isLoading && <p className="text-center text-gray-400 py-20">Loading quizzes...</p>}

        {!isLoading && quizzes.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t created any quizzes yet.</p>
            <Link to="/teacher/quizzes/create" className="inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              Create Your First Quiz
            </Link>
          </div>
        )}

        {!isLoading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight flex-1 mr-2">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${statusBadge(quiz.status)}`}>{quiz.status}</span>
                  </div>
                  {quiz.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{quiz.description}</p>}
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span>⏱ {quiz.duration} min</span>
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">#{quiz.joinCode}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                  <Link to={`/teacher/quizzes/${quiz._id}/edit`} className="flex-1 text-center py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-orange-50 hover:bg-gray-100 rounded transition-colors">Edit</Link>
                  <Link to={`/teacher/quizzes/${quiz._id}/results`} className="flex-1 text-center py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded transition-colors">Results</Link>
                  <Link to={`/teacher/quizzes/${quiz._id}/analytics`} className="flex-1 text-center py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors">Analytics</Link>
                  {quiz.status === 'active' && (
                    <Link to={`/teacher/live/${quiz.joinCode}`} className="flex-1 text-center py-1.5 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors">Live</Link>
                  )}
                  <button onClick={() => handleDelete(quiz._id)} disabled={deleteId === quiz._id}
                    className="flex-1 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors disabled:opacity-50">
                    {deleteId === quiz._id ? '...' : 'Delete'}
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
