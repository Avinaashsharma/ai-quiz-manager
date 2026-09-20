import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { connectSocket, disconnectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import LiveLeaderboard from '../components/LiveLeaderboard';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AttemptAnswer {
  questionId: string;
  selectedAnswer: number;
}

interface AttemptData {
  _id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  submittedAt: string;
  answers: AttemptAnswer[];
  quiz: {
    _id: string;
    title: string;
    description: string;
    questions: Question[];
  };
}

const QuizResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const joinCode = (location.state as { joinCode?: string } | null)?.joinCode;
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  interface LeaderboardEntry {
    userId: string;
    name: string;
    score: number;
    totalQuestions: number;
    percentage: number;
  }
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Listen for leaderboard updates via socket
  useEffect(() => {
    if (!joinCode) return;

    const socket = connectSocket();
    socket.emit('student:join-room', { joinCode });

    socket.on('leaderboard:updated', (data: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(data.leaderboard);
    });

    socket.on('room:joined', (data: { leaderboard?: LeaderboardEntry[] }) => {
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    });

    return () => {
      socket.off('leaderboard:updated');
      socket.off('room:joined');
      disconnectSocket();
    };
  }, [joinCode]);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/attempts/${id}`);
        setAttempt(res.data.data.attempt);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load results');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttempt();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <p className="text-red-300 text-xl mb-4">{error || 'Results not found'}</p>
        <Link to="/student/dashboard" className="px-6 py-3 bg-purple-600 rounded-xl font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const scoreColor =
    attempt.percentage >= 80
      ? 'text-green-400'
      : attempt.percentage >= 50
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Score Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{attempt.quiz.title}</h1>
          <p className="text-purple-300 text-sm mb-6">Quiz Completed!</p>
          <div className={`text-7xl font-bold mb-4 ${scoreColor}`}>
            {attempt.percentage}%
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-green-400 text-2xl font-bold">{attempt.correctAnswers}</p>
              <p className="text-white/50 text-xs">Correct</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-red-400 text-2xl font-bold">{attempt.wrongAnswers}</p>
              <p className="text-white/50 text-xs">Wrong</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-purple-300 text-2xl font-bold">{attempt.totalQuestions}</p>
              <p className="text-white/50 text-xs">Total</p>
            </div>
          </div>
          <p className="text-white/40 text-sm mt-4">
            Submitted {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Live Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="mb-8">
            <LiveLeaderboard leaderboard={leaderboard} currentUserId={user?._id} />
          </div>
        )}

        {/* Question Review */}
        <h2 className="text-xl font-semibold mb-4">Review Answers</h2>
        <div className="space-y-4">
          {attempt.quiz.questions.map((q, qIndex) => {
            const studentAnswer = attempt.answers.find((a) => a.questionId === q._id);
            const selected = studentAnswer?.selectedAnswer ?? -1;
            const isCorrect = selected === q.correctAnswer;

            return (
              <div
                key={q._id}
                className={`bg-white/10 backdrop-blur-md border rounded-2xl p-6 ${
                  isCorrect ? 'border-green-500/30' : 'border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                    }`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <p className="font-medium">
                    <span className="text-purple-400 mr-1">Q{qIndex + 1}.</span>
                    {q.question}
                  </p>
                </div>

                <div className="space-y-2 ml-11">
                  {q.options.map((opt, oIndex) => {
                    let style = 'bg-white/5 border-white/10 text-white/60';
                    if (oIndex === q.correctAnswer) {
                      style = 'bg-green-500/20 border-green-500/30 text-green-300';
                    } else if (oIndex === selected && oIndex !== q.correctAnswer) {
                      style = 'bg-red-500/20 border-red-500/30 text-red-300';
                    }

                    return (
                      <div
                        key={oIndex}
                        className={`px-4 py-2.5 rounded-xl border text-sm ${style}`}
                      >
                        <span className="font-semibold mr-2">
                          {String.fromCharCode(65 + oIndex)}.
                        </span>
                        {opt}
                        {oIndex === q.correctAnswer && (
                          <span className="ml-2 text-green-400 text-xs">✓ Correct</span>
                        )}
                        {oIndex === selected && oIndex !== q.correctAnswer && (
                          <span className="ml-2 text-red-400 text-xs">✗ Your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-purple-300 text-sm mt-3 ml-11">
                    💡 {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/student/dashboard"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
