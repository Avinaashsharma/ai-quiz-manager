import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Footer from '../components/Footer';

interface AttemptSummary {
  _id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  quiz: { _id: string; title: string; description: string } | null;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts');
        // Filter out attempts whose quiz was deleted (safety net)
        setAttempts((res.data.data.attempts as AttemptSummary[]).filter((a) => a.quiz != null));
      } catch { /* Dashboard still usable */ } finally { setIsLoading(false); }
    };
    fetchAttempts();
  }, []);

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) : 0;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);

  const excellentCount = attempts.filter((a) => a.percentage >= 80).length;
  const goodCount = attempts.filter((a) => a.percentage >= 50 && a.percentage < 80).length;
  const needsWorkCount = attempts.filter((a) => a.percentage < 50).length;

  const scoreColor = (pct: number) =>
    pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500';
  const scoreBg = (pct: number) =>
    pct >= 80 ? 'bg-green-50' : pct >= 50 ? 'bg-orange-50' : 'bg-red-50';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const recentAttempts = attempts.slice(0, 5);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50 flex flex-col justify-between relative overflow-hidden">
      {/* Animated geometric background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Large soft ring top-right */}
        <svg className="absolute -top-16 -right-16 w-72 h-72 animate-[spin_30s_linear_infinite] opacity-[0.07]" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" strokeWidth="18"/></svg>
        {/* Medium filled circle bottom-left */}
        <svg className="absolute -bottom-20 -left-16 w-64 h-64 animate-float opacity-[0.06]" style={{animationDuration:'8s'}} viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#fb923c"/></svg>
        {/* Triangle top-left */}
        <svg className="absolute top-10 left-[12%] w-12 h-12 animate-float-reverse opacity-[0.1]" style={{animationDuration:'5s'}} viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="none" stroke="#f97316" strokeWidth="8"/></svg>
        {/* Small solid dot cluster top-center */}
        <svg className="absolute top-6 left-[42%] w-8 h-8 animate-float opacity-[0.12]" style={{animationDuration:'4s'}} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fdba74"/></svg>
        {/* Hexagon mid-right */}
        <svg className="absolute top-[35%] right-[4%] w-14 h-14 animate-float-reverse opacity-[0.09]" style={{animationDuration:'6s'}} viewBox="0 0 100 100"><polygon points="50,5 93,27 93,73 50,95 7,73 7,27" fill="none" stroke="#f97316" strokeWidth="7"/></svg>
        {/* Small ring mid-left */}
        <svg className="absolute top-[50%] left-[4%] w-10 h-10 animate-float opacity-[0.12]" style={{animationDuration:'5.5s'}} viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="none" stroke="#fb923c" strokeWidth="12"/></svg>
        {/* Large ring bottom-right */}
        <svg className="absolute -bottom-10 right-[8%] w-48 h-48 animate-[spin_25s_linear_infinite_reverse] opacity-[0.06]" viewBox="0 0 200 200"><circle cx="100" cy="100" r="75" fill="none" stroke="#f97316" strokeWidth="20"/></svg>
        {/* Small square bottom-center */}
        <svg className="absolute bottom-[10%] left-[38%] w-8 h-8 animate-float-reverse opacity-[0.1]" style={{animationDuration:'4.5s'}} viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" rx="12" fill="none" stroke="#f97316" strokeWidth="9"/></svg>
        {/* Tiny triangle bottom-left area */}
        <svg className="absolute bottom-[20%] left-[18%] w-7 h-7 animate-float opacity-[0.09]" style={{animationDuration:'6.5s'}} viewBox="0 0 100 100"><polygon points="50,5 95,90 5,90" fill="#fb923c"/></svg>
        {/* Dot pattern grid top-left */}
        <svg className="absolute top-8 left-8 opacity-[0.06]" width="96" height="96"><pattern id="db-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#f97316"/></pattern><rect width="96" height="96" fill="url(#db-dots)"/></svg>
        {/* Dot pattern grid bottom-right */}
        <svg className="absolute bottom-10 right-10 opacity-[0.06]" width="80" height="80"><pattern id="db-dots2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#f97316"/></pattern><rect width="80" height="80" fill="url(#db-dots2)"/></svg>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-lg font-medium text-gray-600">Welcome,</span>
              <span className="text-3xl font-bold text-orange-400">{user?.name}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your quiz activity at a glance</p>
          </div>
          <Link to="/student/join" className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors">
            Join Quiz
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { emoji: '📝', label: 'Quizzes Taken', value: attempts.length, color: 'orange' },
            { emoji: '📊', label: 'Avg. Score', value: `${avgScore}%`, color: avgScore >= 80 ? 'green' : avgScore >= 50 ? 'amber' : 'gray' },
            { emoji: '🏆', label: 'Best Score', value: `${bestScore}%`, color: 'green' },
            { emoji: '❓', label: 'Questions Answered', value: totalQuestionsAnswered, color: 'purple' },
          ].map((card) => {
            const accents: Record<string, { border: string; bg: string; iconBg: string; text: string }> = {
              orange: { border: 'border-orange-200', bg: 'from-orange-50/80 to-white', iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200/60', text: 'text-orange-600' },
              green:  { border: 'border-green-200',  bg: 'from-green-50/80 to-white',  iconBg: 'bg-gradient-to-br from-green-100 to-green-200/60',  text: 'text-green-600' },
              amber:  { border: 'border-amber-200',  bg: 'from-amber-50/80 to-white',  iconBg: 'bg-gradient-to-br from-amber-100 to-amber-200/60',  text: 'text-amber-600' },
              purple: { border: 'border-purple-200', bg: 'from-purple-50/80 to-white', iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200/60', text: 'text-purple-600' },
              gray:   { border: 'border-gray-200',   bg: 'from-gray-50/80 to-white',   iconBg: 'bg-gradient-to-br from-gray-100 to-gray-200/60',   text: 'text-gray-700' },
            };
            const a = accents[card.color];
            return (
              <div
                key={card.label}
                className={`relative overflow-hidden bg-gradient-to-br ${a.bg} border ${a.border} rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
              >
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

        {/* Main Content: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Attempts */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attempts</h2>
            {isLoading ? (
              <p className="text-gray-400">Loading...</p>
            ) : attempts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-gray-900 font-semibold mb-1">No quizzes taken yet</p>
                <p className="text-gray-500 text-sm mb-4">Join your first quiz and start tracking your progress!</p>
                <Link to="/student/join" className="inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
                  Join Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <Link
                    key={attempt._id}
                    to={`/student/results/${attempt._id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`shrink-0 w-10 h-10 rounded-lg ${scoreBg(attempt.percentage)} flex items-center justify-center text-sm font-bold ${scoreColor(attempt.percentage)}`}>
                          {attempt.percentage}%
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{attempt.quiz!.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {attempt.score}/{attempt.totalQuestions} correct · {formatDate(attempt.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-300 text-sm shrink-0 ml-2">→</span>
                    </div>
                  </Link>
                ))}
                {attempts.length > 5 ? (
                  <Link
                    to="/student/attempts"
                    className="block text-center text-sm text-orange-600 hover:text-orange-700 font-semibold pt-2 transition-colors"
                  >
                    View all {attempts.length} attempts →
                  </Link>
                ) : (
                  attempts.length > 0 && (
                    <Link
                      to="/student/attempts"
                      className="block text-center text-xs text-gray-400 hover:text-orange-600 font-medium pt-2 transition-colors"
                    >
                      View full attempt history →
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Score Distribution */}
            {attempts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Score Distribution</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Excellent (80%+)</span>
                      <span className="font-medium text-green-600">{excellentCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${attempts.length ? (excellentCount / attempts.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Good (50-79%)</span>
                      <span className="font-medium text-orange-500">{goodCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${attempts.length ? (goodCount / attempts.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Needs Work (&lt;50%)</span>
                      <span className="font-medium text-red-500">{needsWorkCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full transition-all" style={{ width: `${attempts.length ? (needsWorkCount / attempts.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">💡 Quick Tips</h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Ask your teacher for a <strong className="text-gray-700">Join Code</strong> to take a quiz.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Review your <strong className="text-gray-700">Results</strong> after each attempt to learn from mistakes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Aim for <strong className="text-gray-700">80%+</strong> to land in the Excellent category.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">●</span>
                  <span>Click any attempt to see <strong className="text-gray-700">detailed question-by-question</strong> breakdown.</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">🚀 How It Works</h3>
              <ol className="space-y-2.5 text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span>Get a join code from your teacher</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span>Enter the code &amp; start the quiz</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span>Answer all questions before time runs out</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-orange-100 text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span>View your score &amp; review answers</span>
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

export default StudentDashboard;
