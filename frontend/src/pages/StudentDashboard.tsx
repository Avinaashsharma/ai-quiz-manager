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
              <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-white border-2 border-orange-100 rounded-2xl p-10 text-center overflow-hidden">
                {/* decorative blobs */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
                {/* icon with glow ring */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-md border border-orange-100 mb-5">
                  <span className="text-4xl animate-float-slow inline-block">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No quizzes taken yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                  Join your first quiz, test your knowledge, and start tracking your progress!
                </p>
                <Link
                  to="/student/join"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>🚀</span> Join Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => {
                  const pct = attempt.percentage;
                  const isExcellent = pct >= 80;
                  const isGood = pct >= 50;
                  const accentBar = isExcellent ? 'bg-green-400' : isGood ? 'bg-orange-400' : 'bg-red-400';
                  const cardBg = isExcellent ? 'from-green-50/50 to-white hover:border-green-200' : isGood ? 'from-orange-50/50 to-white hover:border-orange-200' : 'from-red-50/50 to-white hover:border-red-200';
                  const scorePill = isExcellent ? 'from-green-400 to-emerald-500' : isGood ? 'from-orange-400 to-amber-500' : 'from-red-400 to-rose-500';
                  return (
                    <Link
                      key={attempt._id}
                      to={`/student/results/${attempt._id}`}
                      className={`flex items-stretch bg-gradient-to-r ${cardBg} border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                    >
                      {/* left accent bar */}
                      <span className={`w-1.5 shrink-0 ${accentBar}`} />
                      <div className="flex items-center gap-4 p-4 w-full min-w-0">
                        {/* score pill */}
                        <span className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${scorePill} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                          {pct}%
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">{attempt.quiz!.title}</h3>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {attempt.score}/{attempt.totalQuestions} correct · {formatDate(attempt.submittedAt)}
                          </p>
                        </div>
                        <span className="text-gray-300 shrink-0 text-lg">›</span>
                      </div>
                    </Link>
                  );
                })}
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
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📊</span>
                  <h3 className="font-bold text-gray-900 text-sm">Score Distribution</h3>
                </div>
                <div className="space-y-4">
                  {/* Excellent */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        <span className="text-sm text-gray-600">Excellent (80%+)</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{excellentCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${attempts.length ? (excellentCount / attempts.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  {/* Good */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                        <span className="text-sm text-gray-600">Good (50–79%)</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{goodCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-amber-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${attempts.length ? (goodCount / attempts.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  {/* Needs Work */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        <span className="text-sm text-gray-600">Needs Work (&lt;50%)</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{needsWorkCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-red-400 to-rose-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${attempts.length ? (needsWorkCount / attempts.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg animate-float-slow inline-block">💡</span>
                <h3 className="font-bold text-gray-900 text-sm">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-base">🔑</span>
                  <span>Ask your teacher for a <strong className="text-gray-800">Join Code</strong> to enter a quiz.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-base">📝</span>
                  <span>Review your <strong className="text-gray-800">Results</strong> after each attempt to learn from mistakes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-base">🎯</span>
                  <span>Aim for <strong className="text-gray-800">80%+</strong> to land in the Excellent category.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-base">📊</span>
                  <span>Click any attempt for a <strong className="text-gray-800">question-by-question</strong> breakdown.</span>
                </li>
              </ul>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-br from-violet-50 to-white border-2 border-violet-100 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-violet-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg animate-float inline-block">🚀</span>
                <h3 className="font-bold text-gray-900 text-sm">How It Works</h3>
              </div>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <span>Get a <strong className="text-gray-800">join code</strong> from your teacher</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Enter the code &amp; <strong className="text-gray-800">start the quiz</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <span>Answer all questions <strong className="text-gray-800">before time runs out</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs font-bold">4</span>
                  <span>View your <strong className="text-gray-800">score &amp; review answers</strong></span>
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
