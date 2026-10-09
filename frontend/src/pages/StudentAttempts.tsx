import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';

interface AttemptSummary {
  _id: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  quiz: { _id: string; title: string; description?: string } | null;
}

const StudentAttempts: React.FC = () => {
  const [attempts, setAttempts] = useState<AttemptSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'passed' | 'review'>('all');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts');
        const list = (res.data?.data?.attempts as AttemptSummary[]) || [];
        // Filter out records where quiz is null (deleted quizzes)
        setAttempts(list.filter((a) => a.quiz != null));
      } catch {
        // Keep attempts empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const totalAttempts = attempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
      : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const passedCount = attempts.filter((a) => a.percentage >= 50).length;

  const filteredAttempts = useMemo(() => {
    return attempts.filter((a) => {
      const title = a.quiz?.title?.toLowerCase() || '';
      const matchesSearch = title.includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (filter === 'passed') return a.percentage >= 50;
      if (filter === 'review') return a.percentage < 50;
      return true;
    });
  }, [attempts, searchQuery, filter]);



  const scoreBadgeBg = (pct: number) =>
    pct >= 80
      ? 'bg-green-100 text-green-700'
      : pct >= 50
      ? 'bg-orange-100 text-orange-700'
      : 'bg-red-100 text-red-700';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50 flex flex-col justify-between relative overflow-hidden">
      {/* Unique wave-lines background for Attempts page */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,200 C240,120 480,280 720,200 C960,120 1200,280 1440,200" fill="none" stroke="#f97316" strokeWidth="3">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -40" dur="4s" repeatCount="indefinite" additive="sum"/>
            <animate attributeName="opacity" from="0.6" to="1" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M0,350 C240,270 480,430 720,350 C960,270 1200,430 1440,350" fill="none" stroke="#f97316" strokeWidth="2.5">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 50" dur="5s" repeatCount="indefinite" additive="sum"/>
          </path>
          <path d="M0,500 C360,400 720,600 1080,500 C1260,450 1380,550 1440,500" fill="none" stroke="#fb923c" strokeWidth="2">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -30" dur="6s" repeatCount="indefinite" additive="sum"/>
          </path>
          <path d="M0,650 C240,580 480,720 720,650 C960,580 1200,720 1440,650" fill="none" stroke="#f97316" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 40" dur="4.5s" repeatCount="indefinite" additive="sum"/>
          </path>
          <path d="M0,100 C360,60 720,140 1080,100 C1260,80 1380,120 1440,100" fill="none" stroke="#fdba74" strokeWidth="2">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -50" dur="7s" repeatCount="indefinite" additive="sum"/>
          </path>
        </svg>
        {/* Corner accents */}
        <svg className="absolute top-0 left-0 w-40 h-40 opacity-[0.06]" viewBox="0 0 160 160"><path d="M0,0 Q80,80 160,0 Q80,80 0,160" fill="none" stroke="#f97316" strokeWidth="4"/></svg>
        <svg className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.06]" viewBox="0 0 160 160"><path d="M160,160 Q80,80 0,160 Q80,80 160,0" fill="none" stroke="#f97316" strokeWidth="4"/></svg>
        {/* Small pulsing dots along wave */}
        <div className="absolute top-[24%] left-[20%] w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-30" style={{animationDuration:'3s'}}/>
        <div className="absolute top-[42%] left-[50%] w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-25" style={{animationDuration:'4s', animationDelay:'1s'}}/>
        <div className="absolute top-[60%] left-[75%] w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-30" style={{animationDuration:'3.5s', animationDelay:'2s'}}/>
        <div className="absolute top-[78%] left-[30%] w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-20" style={{animationDuration:'5s', animationDelay:'0.5s'}}/>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quiz Attempts</h1>
            <p className="text-gray-500 text-sm mt-1">
              Review your complete quiz history, past answers, and performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/student/dashboard"
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/student/join"
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Join Quiz
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-8">
          {[
            { emoji: '📝', label: 'Total Attempts', value: totalAttempts, accent: 'bg-orange-500', text: 'text-orange-600' },
            { emoji: '📊', label: 'Avg. Score', value: `${avgScore}%`, accent: avgScore >= 80 ? 'bg-green-500' : avgScore >= 50 ? 'bg-amber-500' : 'bg-gray-400', text: avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-amber-600' : 'text-gray-600' },
            { emoji: '🏆', label: 'Best Score', value: `${bestScore}%`, accent: 'bg-green-500', text: 'text-green-600' },
            { emoji: '✅', label: 'Passed', value: passedCount, accent: 'bg-purple-500', text: 'text-purple-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex">
              <div className={`w-1 sm:w-1.5 ${card.accent} shrink-0`} />
              <div className="p-2.5 sm:p-3.5 flex-1">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className="text-sm sm:text-lg">{card.emoji}</span>
                  <span className="text-[8px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{card.label}</span>
                </div>
                <p className={`text-xl sm:text-2xl font-extrabold ${card.text}`}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by quiz title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'passed'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Passed ({passedCount})
            </button>
            <button
              onClick={() => setFilter('review')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'review'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Needs Work ({totalAttempts - passedCount})
            </button>
          </div>
        </div>

        {/* Attempts Content */}
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-400">Loading your attempts...</p>
          </div>
        ) : attempts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-5xl mb-4">🎯</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">No quiz attempts yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              You haven&apos;t attempted any quizzes yet. Enter a quiz code to take your first quiz!
            </p>
            <Link
              to="/student/join"
              className="inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Join a Quiz
            </Link>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <h2 className="text-base font-semibold text-gray-900 mb-1">No matching attempts found</h2>
            <p className="text-gray-500 text-sm mb-4">
              Try adjusting your search query or filter to see results.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAttempts.map((attempt) => {
              const pct = attempt.percentage;
              const isExcellent = pct >= 80;
              const isGood = pct >= 50;
              const accentBar = isExcellent ? 'bg-green-400' : isGood ? 'bg-orange-400' : 'bg-red-400';
              const cardBg = isExcellent ? 'from-green-50/50 to-white hover:border-green-200' : isGood ? 'from-orange-50/50 to-white hover:border-orange-200' : 'from-red-50/50 to-white hover:border-red-200';
              const scorePill = isExcellent ? 'from-green-400 to-emerald-500' : isGood ? 'from-orange-400 to-amber-500' : 'from-red-400 to-rose-500';
              return (
                <div
                  key={attempt._id}
                  className={`flex items-stretch bg-gradient-to-r ${cardBg} border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                >
                  {/* left accent bar */}
                  <span className={`w-1.5 shrink-0 ${accentBar}`} />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 w-full min-w-0">
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      {/* score pill */}
                      <span className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${scorePill} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                        {pct}%
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base truncate">
                          {attempt.quiz?.title || 'Quiz'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{attempt.score}/{attempt.totalQuestions} Correct</span>
                          <span>•</span>
                          <span>{formatDate(attempt.submittedAt)}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${scoreBadgeBg(pct)}`}>
                            {isExcellent ? 'Excellent' : isGood ? 'Good' : 'Needs Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <Link
                        to={`/student/results/${attempt._id}`}
                        className="px-4 py-2 bg-white hover:bg-orange-50 border border-orange-200 text-orange-600 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
                      >
                        <span>View Result</span>
                        <span>›</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StudentAttempts;
