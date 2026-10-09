import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Footer from '../components/Footer';

interface QuizSummary {
  _id: string;
  title: string;
  status: string;
  joinCode: string;
  description: string;
  duration: number;
  createdAt: string;
  questions: { _id: string }[];
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
  const closedCount = quizzes.filter((q) => q.status === 'closed').length;
  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

  const recentQuizzes = [...quizzes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'closed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50 flex flex-col justify-between relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <svg className="absolute -top-16 -left-16 w-72 h-72 animate-[spin_30s_linear_infinite] opacity-[0.07]" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" strokeWidth="18"/></svg>
        <svg className="absolute -bottom-20 -right-16 w-64 h-64 animate-float opacity-[0.06]" style={{animationDuration:'8s'}} viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#fb923c"/></svg>
        <svg className="absolute top-10 right-[12%] w-12 h-12 animate-float-reverse opacity-[0.1]" style={{animationDuration:'5s'}} viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="none" stroke="#f97316" strokeWidth="8"/></svg>
        <svg className="absolute top-6 left-[42%] w-8 h-8 animate-float opacity-[0.12]" style={{animationDuration:'4s'}} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fdba74"/></svg>
        <svg className="absolute top-[35%] left-[4%] w-14 h-14 animate-float-reverse opacity-[0.09]" style={{animationDuration:'6s'}} viewBox="0 0 100 100"><polygon points="50,5 93,27 93,73 50,95 7,73 7,27" fill="none" stroke="#f97316" strokeWidth="7"/></svg>
        <svg className="absolute top-[50%] right-[4%] w-10 h-10 animate-float opacity-[0.12]" style={{animationDuration:'5.5s'}} viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="#fb923c" strokeWidth="12"/></svg>
        <svg className="absolute -bottom-10 left-[8%] w-48 h-48 animate-[spin_25s_linear_infinite_reverse] opacity-[0.06]" viewBox="0 0 200 200"><circle cx="100" cy="100" r="75" fill="none" stroke="#f97316" strokeWidth="20"/></svg>
        <svg className="absolute bottom-[10%] right-[38%] w-8 h-8 animate-float-reverse opacity-[0.1]" style={{animationDuration:'4.5s'}} viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="#f97316" strokeWidth="9"/></svg>
        <svg className="absolute bottom-[20%] right-[18%] w-7 h-7 animate-float opacity-[0.09]" style={{animationDuration:'6.5s'}} viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="#fb923c"/></svg>
        <svg className="absolute top-8 right-8 opacity-[0.06]" width="96" height="96"><pattern id="td-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#f97316"/></pattern><rect width="96" height="96" fill="url(#td-dots)"/></svg>
        <svg className="absolute bottom-10 left-10 opacity-[0.06]" width="80" height="80"><pattern id="td-dots2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#f97316"/></pattern><rect width="80" height="80" fill="url(#td-dots2)"/></svg>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg font-medium text-gray-600">Welcome,</span>
            <span className="text-3xl font-bold text-orange-400">{user?.name}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s an overview of your quizzes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { emoji: '📝', label: 'Total Quizzes', value: isLoading ? '...' : quizzes.length, color: 'orange' },
            { emoji: '✅', label: 'Active', value: isLoading ? '...' : activeCount, color: 'green' },
            { emoji: '📋', label: 'Drafts', value: isLoading ? '...' : draftCount, color: 'amber' },
            { emoji: '❓', label: 'Total Questions', value: isLoading ? '...' : totalQuestions, color: 'purple' },
          ].map((card) => {
            const accents: Record<string, { border: string; bg: string; iconBg: string; text: string }> = {
              orange: { border: 'border-orange-200', bg: 'from-orange-50/80 to-white', iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200/60', text: 'text-orange-600' },
              green:  { border: 'border-green-200',  bg: 'from-green-50/80 to-white',  iconBg: 'bg-gradient-to-br from-green-100 to-green-200/60',  text: 'text-green-600' },
              amber:  { border: 'border-amber-200',  bg: 'from-amber-50/80 to-white',  iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200/60',  text: 'text-amber-600' },
              purple: { border: 'border-purple-200', bg: 'from-purple-50/80 to-white', iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200/60', text: 'text-purple-600' },
            };
            const a = accents[card.color];
            return (
              <div
                key={card.label}
                className={`relative overflow-hidden bg-gradient-to-br ${a.bg} border ${a.border} rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
              >
                {/* Decorative corner glow */}
                <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full ${a.iconBg} opacity-40 blur-lg`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center text-lg shadow-sm`}>{card.emoji}</span>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  </div>
                  <p className={`text-3xl font-bold ${a.text}`}>{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="relative bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-5 sm:p-8 text-center mb-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />
          <div className="text-3xl mb-2">🚀</div>
          <p className="text-gray-600 font-medium mb-1 text-sm sm:text-base">
            {quizzes.length === 0 ? 'Welcome! Create your first quiz to get started.' : 'Create a new quiz or manage existing ones.'}
          </p>
          <p className="text-gray-400 text-xs mb-5">Powered by AI — generate questions instantly</p>
          <div className="flex gap-2 sm:gap-3 justify-center items-center flex-nowrap">
            <Link
              to="/teacher/quizzes/create"
              className="px-5 sm:px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base whitespace-nowrap shadow-md shadow-orange-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              ✨ Create Quiz
            </Link>
            {quizzes.length > 0 && (
              <Link
                to="/teacher/quizzes"
                className="px-5 sm:px-6 py-2.5 bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-200 hover:border-orange-400 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                View All Quizzes →
              </Link>
            )}
          </div>
        </div>

        {/* Recent Quizzes & Tips - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Quizzes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Quizzes</h2>
              {quizzes.length > 3 && (
                <Link to="/teacher/quizzes" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                  View all →
                </Link>
              )}
            </div>
            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : recentQuizzes.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-gray-500 mb-1 font-medium">No quizzes yet</p>
                <p className="text-gray-400 text-sm">Create your first quiz and share it with students!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuizzes.map((quiz) => {
                  const accent = quiz.status === 'active'
                    ? 'border-l-4 border-l-green-400 bg-gradient-to-r from-green-50/60 to-white'
                    : quiz.status === 'closed'
                    ? 'border-l-4 border-l-red-300 bg-gradient-to-r from-red-50/40 to-white'
                    : 'border-l-4 border-l-amber-300 bg-gradient-to-r from-amber-50/40 to-white';
                  const codeColor = quiz.status === 'active' ? 'bg-green-100 text-green-700'
                    : quiz.status === 'closed' ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700';
                  return (
                    <div key={quiz._id} className={`${accent} border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all duration-200`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className="font-bold text-gray-900 truncate">{quiz.title}</h3>
                          {quiz.description && (
                            <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{quiz.description}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${statusBadge(quiz.status)}`}>
                          {quiz.status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse align-middle" />}
                          {quiz.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mt-2">
                        <span>⏱ {quiz.duration} min</span>
                        <span>❓ {quiz.questions?.length || 0} questions</span>
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-full font-semibold ${codeColor}`}>#{quiz.joinCode}</span>
                        <span className="hidden sm:inline text-xs">📅 {formatDate(quiz.createdAt)}</span>
                      </div>
                      <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-100">
                        <Link to={`/teacher/quizzes/${quiz._id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-white bg-gray-100 hover:bg-gray-600 rounded-full transition-all duration-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.536.884.884-3.536A4 4 0 019 13z" /></svg>
                          Edit
                        </Link>
                        <Link to={`/teacher/quizzes/${quiz._id}/results`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-500 rounded-full transition-all duration-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6v-4m4 4V9M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                          Results
                        </Link>
                        <Link to={`/teacher/quizzes/${quiz._id}/analytics`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-500 rounded-full transition-all duration-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                          Analytics
                        </Link>
                        {quiz.status === 'active' && (
                          <Link to={`/teacher/live/${quiz.joinCode}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-600 hover:text-white bg-green-50 hover:bg-green-500 rounded-full transition-all duration-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            Live
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tips & Quick Info Sidebar */}
          <div className="space-y-4">
            {/* Status Breakdown */}
            {!isLoading && quizzes.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">📊</span>
                  <h3 className="font-bold text-gray-800 text-sm">Quiz Status Breakdown</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Active', count: activeCount, bar: 'bg-gradient-to-r from-green-400 to-emerald-500', badge: 'bg-green-100 text-green-700', icon: '🟢' },
                    { label: 'Drafts', count: draftCount,  bar: 'bg-gradient-to-r from-amber-400 to-orange-400',  badge: 'bg-amber-100 text-amber-700',  icon: '🟡' },
                    { label: 'Closed', count: closedCount, bar: 'bg-gradient-to-r from-red-400 to-rose-500',      badge: 'bg-red-100 text-red-700',      icon: '🔴' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5"><span className="text-xs">{s.icon}</span>{s.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{s.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className={`${s.bar} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${quizzes.length ? (s.count / quizzes.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Getting Started Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-base">💡</div>
                <h3 className="font-bold text-gray-800 text-sm">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-500">
                {[
                  { icon: '🤖', tip: <><strong className="text-gray-700">AI Generation</strong> — create quiz questions instantly from any topic.</> },
                  { icon: '🔗', tip: <><strong className="text-gray-700">Join Code</strong> — share with students so they can take the quiz.</> },
                  { icon: '🟢', tip: <>Set status to <strong className="text-gray-700">Active</strong> when you&apos;re ready for students to attempt it.</> },
                  { icon: '📊', tip: <>Check <strong className="text-gray-700">Analytics</strong> for detailed insights on student performance.</> },
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">{t.icon}</span>
                    <span>{t.tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-violet-50 to-white border-2 border-violet-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-base">🚀</div>
                <h3 className="font-bold text-gray-800 text-sm">How It Works</h3>
              </div>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  { step: 1, color: 'bg-gradient-to-br from-violet-400 to-purple-500', text: 'Create a quiz with AI or manually' },
                  { step: 2, color: 'bg-gradient-to-br from-blue-400 to-cyan-500',     text: 'Set it to Active & share the code' },
                  { step: 3, color: 'bg-gradient-to-br from-green-400 to-emerald-500', text: 'Students join & take the quiz' },
                  { step: 4, color: 'bg-gradient-to-br from-orange-400 to-rose-500',   text: 'View results & analytics live' },
                ].map(s => (
                  <li key={s.step} className="flex items-start gap-3">
                    <span className={`${s.color} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm`}>{s.step}</span>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
