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
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-lg">📝</span>
              <p className="text-sm text-gray-500">Total Quizzes</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : quizzes.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-lg">✅</span>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : activeCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center text-lg">📋</span>
              <p className="text-sm text-gray-500">Drafts</p>
            </div>
            <p className="text-3xl font-bold text-orange-500">{isLoading ? '...' : draftCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-lg">❓</span>
              <p className="text-sm text-gray-500">Total Questions</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{isLoading ? '...' : totalQuestions}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-8 text-center mb-8">
          <p className="text-gray-500 mb-4 text-xs sm:text-base">
            {quizzes.length === 0 ? 'Create your first quiz to get started.' : 'Create a new quiz or manage existing ones.'}
          </p>
          <div className="flex gap-2 sm:gap-3 justify-center items-center flex-nowrap">
            <Link
              to="/teacher/quizzes/create"
              className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors text-xs sm:text-base whitespace-nowrap"
            >
              + Create Quiz
            </Link>
            {quizzes.length > 0 && (
              <Link
                to="/teacher/quizzes"
                className="px-3.5 sm:px-6 py-2 sm:py-2.5 bg-white hover:bg-orange-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors text-xs sm:text-base whitespace-nowrap"
              >
                View All Quizzes
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
                {recentQuizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <h3 className="font-semibold text-gray-900 truncate">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{quiz.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 ${statusBadge(quiz.status)}`}>
                        {quiz.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mt-3">
                      <span>⏱ {quiz.duration} min</span>
                      <span>❓ {quiz.questions?.length || 0} questions</span>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 text-xs">#{quiz.joinCode}</span>
                      <span className="hidden sm:inline">📅 {formatDate(quiz.createdAt)}</span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Link to={`/teacher/quizzes/${quiz._id}/edit`} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
                        Edit
                      </Link>
                      <Link to={`/teacher/quizzes/${quiz._id}/results`} className="px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded transition-colors">
                        Results
                      </Link>
                      <Link to={`/teacher/quizzes/${quiz._id}/analytics`} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors">
                        Analytics
                      </Link>
                      {quiz.status === 'active' && (
                        <Link to={`/teacher/live/${quiz.joinCode}`} className="px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors">
                          Live
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips & Quick Info Sidebar */}
          <div className="space-y-4">
            {/* Status Breakdown */}
            {!isLoading && quizzes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quiz Status Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Active</span>
                      <span className="font-medium text-green-600">{activeCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${quizzes.length ? (activeCount / quizzes.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Drafts</span>
                      <span className="font-medium text-orange-500">{draftCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${quizzes.length ? (draftCount / quizzes.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Closed</span>
                      <span className="font-medium text-red-500">{closedCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full transition-all" style={{ width: `${quizzes.length ? (closedCount / quizzes.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Getting Started Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">💡 Quick Tips</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Use <strong className="text-gray-700">AI Generation</strong> to create quiz questions instantly from any topic.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Share the <strong className="text-gray-700">Join Code</strong> with students so they can take the quiz.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Set quiz status to <strong className="text-gray-700">Active</strong> when you&apos;re ready for students to attempt it.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Check <strong className="text-gray-700">Analytics</strong> for detailed insights on student performance.</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">🚀 How It Works</h3>
              <ol className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>Create a quiz with AI or manually</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>Set it to Active &amp; share the code</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>Students join &amp; take the quiz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span>View results &amp; analytics live</span>
                </li>
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
