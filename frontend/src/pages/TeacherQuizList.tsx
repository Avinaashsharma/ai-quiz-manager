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
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-orange-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <span className="absolute text-4xl opacity-40 top-[6%] left-[8%] animate-float" style={{animationDuration:'4s'}}>📝</span>
        <span className="absolute text-5xl opacity-35 top-[12%] right-[10%] animate-float-reverse" style={{animationDuration:'5s'}}>📊</span>
        <span className="absolute text-4xl opacity-40 bottom-[18%] left-[6%] animate-float" style={{animationDuration:'3.5s'}}>🎓</span>
        <span className="absolute text-5xl opacity-35 bottom-[10%] right-[12%] animate-float-reverse" style={{animationDuration:'4.5s'}}>🏆</span>
        <span className="absolute text-3xl opacity-40 top-[42%] left-[4%] animate-float-reverse" style={{animationDuration:'5s'}}>✏️</span>
        <span className="absolute text-3xl opacity-[0.38] top-[28%] right-[5%] animate-float" style={{animationDuration:'3s'}}>💡</span>
        <span className="absolute text-4xl opacity-[0.35] bottom-[32%] right-[28%] animate-float-reverse" style={{animationDuration:'4s'}}>❓</span>
        <span className="absolute text-3xl opacity-[0.40] top-[62%] left-[22%] animate-float" style={{animationDuration:'3.8s'}}>📚</span>
        <span className="absolute text-4xl opacity-[0.35] top-[4%] left-[43%] animate-float-reverse" style={{animationDuration:'4.2s'}}>⭐</span>
        <span className="absolute text-3xl opacity-[0.38] bottom-[6%] left-[38%] animate-float" style={{animationDuration:'3.2s'}}>🎯</span>
        <span className="absolute text-4xl opacity-[0.35] top-[20%] left-[28%] animate-float-reverse" style={{animationDuration:'5.5s'}}>🧠</span>
        <span className="absolute text-3xl opacity-40 bottom-[48%] right-[4%] animate-float" style={{animationDuration:'4.8s'}}>📋</span>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6 animate-[fadeInUp_0.6s_ease-out_both]">
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
            {quizzes.map((quiz, i) => {
              const palettes = [
                { bg: 'from-orange-50 to-amber-50', border: 'border-orange-200', accent: 'bg-gradient-to-r from-orange-400 to-amber-400', code: 'bg-orange-100 text-orange-700' },
                { bg: 'from-blue-50 to-sky-50',    border: 'border-blue-200',   accent: 'bg-gradient-to-r from-blue-400 to-sky-400',   code: 'bg-blue-100 text-blue-700'   },
                { bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', accent: 'bg-gradient-to-r from-violet-400 to-purple-400', code: 'bg-violet-100 text-violet-700' },
                { bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', accent: 'bg-gradient-to-r from-emerald-400 to-teal-400', code: 'bg-emerald-100 text-emerald-700' },
                { bg: 'from-rose-50 to-pink-50',   border: 'border-rose-200',   accent: 'bg-gradient-to-r from-rose-400 to-pink-400',   code: 'bg-rose-100 text-rose-700'   },
                { bg: 'from-cyan-50 to-indigo-50', border: 'border-cyan-200',   accent: 'bg-gradient-to-r from-cyan-400 to-indigo-400', code: 'bg-cyan-100 text-cyan-700'   },
              ];
              const p = palettes[i % palettes.length];
              return (
              <div key={quiz._id} className={`relative bg-gradient-to-br ${p.bg} border ${p.border} rounded-2xl p-3 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 animate-[fadeInUp_0.5s_ease-out_both] overflow-hidden`} style={{ animationDelay: `${i * 80}ms` }}>
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${p.accent}`} />
                <div className="mt-1">
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight flex-1 mr-2">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${statusBadge(quiz.status)}`}>{quiz.status}</span>
                  </div>
                  {quiz.description && <p className="text-gray-500 text-sm mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">{quiz.description}</p>}
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-2 sm:mb-4">
                    <span>⏱ {quiz.duration} min</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${p.code}`}>#{quiz.joinCode}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                  <Link to={`/teacher/quizzes/${quiz._id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-gray-600 hover:text-white bg-gray-100 hover:bg-gray-600 rounded-full transition-all duration-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.536.884.884-3.536A4 4 0 019 13z" /></svg>
                    Edit
                  </Link>
                  <Link to={`/teacher/quizzes/${quiz._id}/results`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 rounded-full transition-all duration-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6v-4m4 4V9M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                    Results
                  </Link>
                  <Link to={`/teacher/quizzes/${quiz._id}/analytics`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-500 rounded-full transition-all duration-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                    Analytics
                  </Link>
                  {quiz.status === 'active' && (
                    <Link to={`/teacher/live/${quiz.joinCode}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-green-600 hover:text-white bg-green-50 hover:bg-green-500 rounded-full transition-all duration-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      Live
                    </Link>
                  )}
                  <button onClick={() => handleDelete(quiz._id)} disabled={deleteId === quiz._id}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-semibold text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-full transition-all duration-200 disabled:opacity-50">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    {deleteId === quiz._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
        <div className="flex items-center gap-3 mt-10 pb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-medium text-gray-400">No more quizzes</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizList;
