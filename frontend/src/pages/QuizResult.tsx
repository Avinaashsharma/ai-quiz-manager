import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { connectSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import LiveLeaderboard from '../components/LiveLeaderboard';

interface Question { _id: string; question: string; options: string[]; correctAnswer: number; explanation: string; }
interface AttemptAnswer { questionId: string; selectedAnswer: number; }
interface AttemptData {
  _id: string; score: number; totalQuestions: number; correctAnswers: number; wrongAnswers: number; percentage: number; submittedAt: string;
  answers: AttemptAnswer[]; quiz: { _id: string; title: string; description: string; questions: Question[] };
}

const QuizResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const joinCode = (location.state as { joinCode?: string } | null)?.joinCode;
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  interface LeaderboardEntry { userId: string; name: string; score: number; totalQuestions: number; percentage: number; }
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!joinCode) return;
    const socket = connectSocket();
    socket.emit('student:join-room', { joinCode });
    socket.on('leaderboard:updated', (data: { leaderboard: LeaderboardEntry[] }) => { setLeaderboard(data.leaderboard); });
    socket.on('room:joined', (data: { leaderboard?: LeaderboardEntry[] }) => { if (data.leaderboard) setLeaderboard(data.leaderboard); });
    return () => { socket.off('leaderboard:updated'); socket.off('room:joined'); disconnectSocket(); };
  }, [joinCode]);

  useEffect(() => {
    const fetchAttempt = async () => {
      try { const res = await api.get(`/attempts/${id}`); setAttempt(res.data.data.attempt); }
      catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
        else setError('Failed to load results');
      } finally { setIsLoading(false); }
    };
    fetchAttempt();
  }, [id]);

  if (isLoading) return <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-orange-50"><p className="text-gray-400">Loading results...</p></div>;
  if (error || !attempt) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-orange-50">
      <p className="text-red-500 text-lg mb-4">{error || 'Results not found'}</p>
      <Link to="/student/dashboard" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold">Back to Dashboard</Link>
    </div>
  );

  const pct = attempt.percentage;
  const scoreColor = pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500';
  const ringColor  = pct >= 80 ? 'border-green-400' : pct >= 50 ? 'border-orange-400' : 'border-red-400';
  const badge = pct >= 80
    ? { emoji: '🏆', label: 'Excellent!', bg: 'bg-green-100 text-green-700' }
    : pct >= 50
    ? { emoji: '👍', label: 'Good Job!', bg: 'bg-orange-100 text-orange-700' }
    : { emoji: '📚', label: 'Keep Practicing', bg: 'bg-red-100 text-red-600' };
  const cardGradient = pct >= 80
    ? 'from-green-50 via-emerald-50 to-white'
    : pct >= 50
    ? 'from-orange-50 via-amber-50 to-white'
    : 'from-red-50 via-rose-50 to-white';
  const ringFill = pct >= 80 ? 'bg-green-50' : pct >= 50 ? 'bg-orange-50' : 'bg-red-50';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Score Card */}
        <div className={`bg-gradient-to-b ${cardGradient} border border-gray-100 rounded-2xl p-6 text-center mb-6 shadow-sm`}>
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-900 mb-1">{attempt.quiz.title}</h1>
          <p className="text-gray-400 text-sm mb-4">Quiz Completed</p>

          {/* Score Ring */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className={`w-28 h-28 rounded-full border-[6px] ${ringColor} ${ringFill} flex flex-col items-center justify-center shadow-inner`}>
              <span className={`text-3xl font-extrabold ${scoreColor}`}>{pct}%</span>
              <span className="text-gray-400 text-xs font-medium mt-0.5">{attempt.score}/{attempt.totalQuestions}</span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg}`}>
              {badge.emoji} {badge.label}
            </span>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto">
            {[
              { value: attempt.correctAnswers, label: 'Correct', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
              { value: attempt.wrongAnswers,   label: 'Wrong',   color: 'text-red-500',   bg: 'bg-red-50',   border: 'border-red-100'   },
              { value: attempt.totalQuestions, label: 'Total',   color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl py-3 px-2`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-5">
            Submitted on {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>

        {leaderboard.length > 0 && <div className="mb-6"><LiveLeaderboard leaderboard={leaderboard} currentUserId={user?._id} /></div>}

        {/* Review */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Answers</h2>
        <div className="space-y-4">
          {attempt.quiz.questions.map((q, qIndex) => {
            const studentAnswer = attempt.answers.find((a) => a.questionId === q._id);
            const selected = studentAnswer?.selectedAnswer ?? -1;
            const isCorrect = selected === q.correctAnswer;
            return (
              <div key={q._id} className={`bg-white border rounded-lg p-5 ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-start gap-3 mb-4">
                  <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <p className="font-medium text-gray-900"><span className="text-orange-500 mr-1">Q{qIndex + 1}.</span>{q.question}</p>
                </div>
                <div className="space-y-2 ml-10">
                  {q.options.map((opt, oIndex) => {
                    let style = 'bg-orange-50 border-gray-200 text-gray-600';
                    if (oIndex === q.correctAnswer) style = 'bg-green-50 border-green-200 text-green-700';
                    else if (oIndex === selected && oIndex !== q.correctAnswer) style = 'bg-red-50 border-red-200 text-red-700';
                    return (
                      <div key={oIndex} className={`px-4 py-2.5 rounded-lg border text-sm ${style}`}>
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + oIndex)}.</span>{opt}
                        {oIndex === q.correctAnswer && <span className="ml-2 text-green-600 text-xs">✓ Correct</span>}
                        {oIndex === selected && oIndex !== q.correctAnswer && <span className="ml-2 text-red-500 text-xs">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && <p className="text-gray-500 text-sm mt-3 ml-10">💡 {q.explanation}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/student/dashboard" className="inline-block px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
