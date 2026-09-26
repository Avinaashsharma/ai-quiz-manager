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

  const scoreColor = attempt.percentage >= 80 ? 'text-green-600' : attempt.percentage >= 50 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{attempt.quiz.title}</h1>
          <p className="text-gray-400 text-sm mb-6">Quiz Completed</p>
          <div className={`text-6xl font-bold mb-4 ${scoreColor}`}>{attempt.percentage}%</div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-600 text-2xl font-bold">{attempt.correctAnswers}</p>
              <p className="text-gray-500 text-xs">Correct</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-red-500 text-2xl font-bold">{attempt.wrongAnswers}</p>
              <p className="text-gray-500 text-xs">Wrong</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-gray-700 text-2xl font-bold">{attempt.totalQuestions}</p>
              <p className="text-gray-500 text-xs">Total</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">Submitted {new Date(attempt.submittedAt).toLocaleString()}</p>
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
