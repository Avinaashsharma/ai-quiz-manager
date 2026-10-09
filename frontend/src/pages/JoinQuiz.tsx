import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import axios from 'axios';

interface QuizData {
  _id: string; title: string; description: string; duration: number;
  questions: { _id: string; question: string; options: string[] }[];
}

const TIPS = [
  { emoji: '📖', text: 'Read each question carefully before answering' },
  { emoji: '⏰', text: 'Keep an eye on the timer' },
  { emoji: '🎯', text: 'Answer every question — no negative marking' },
  { emoji: '💡', text: 'Eliminate wrong options to improve your odds' },
];

const JoinQuiz: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const navigate = useNavigate();

  const handleQuizStart = useCallback(
    (data: { quiz: QuizData }) => {
      navigate(`/student/quiz/${data.quiz._id}/attempt`, { state: { quiz: data.quiz, joinCode: joinCode.toUpperCase() } });
    }, [navigate, joinCode]
  );

  useEffect(() => { return () => { disconnectSocket(); }; }, []);

  // Animated dots for waiting room
  useEffect(() => {
    if (!waitingRoom) return;
    const interval = setInterval(() => setDotCount((d) => (d % 3) + 1), 600);
    return () => clearInterval(interval);
  }, [waitingRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!joinCode.trim()) { setError('Please enter a join code'); return; }
    setIsJoining(true);
    try {
      await api.post('/quizzes/join', { joinCode: joinCode.trim() });
      const socket = connectSocket();
      socket.on('room:joined', (data: { participantCount: number }) => { setWaitingRoom(true); setParticipantCount(data.participantCount); setIsJoining(false); });
      socket.on('room:participant-count', (data: { count: number }) => { setParticipantCount(data.count); });
      socket.on('quiz:started', handleQuizStart);
      socket.on('error', (data: { message: string }) => { setError(data.message); setWaitingRoom(false); setIsJoining(false); });
      socket.emit('student:join-room', { joinCode: joinCode.trim() });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to join quiz');
      setIsJoining(false);
    }
  };

  if (waitingRoom) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-orange-50 px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm text-center relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-60" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-50 rounded-full opacity-60" />

          <div className="relative">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse">
              <span className="text-2xl">⏳</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Waiting for Teacher{'.'.repeat(dotCount)}</h2>
            <p className="text-gray-400 text-sm mb-6">You&apos;ve joined successfully. The quiz will begin shortly.</p>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-5 mb-5">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1.5">Room Code</p>
              <p className="text-3xl font-mono font-bold text-orange-500 tracking-[0.3em]">{joinCode}</p>
            </div>

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {participantCount} student{participantCount !== 1 ? 's' : ''} connected
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 font-medium mb-3">Quick Tips</p>
              <div className="grid grid-cols-2 gap-2">
                {TIPS.map((tip, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2.5 text-left">
                    <span className="text-sm">{tip.emoji}</span>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 relative overflow-hidden">
      {/* Scattered quiz-themed icons */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <span className="absolute text-3xl opacity-20 top-[8%] left-[10%] animate-float" style={{ animationDuration: '4s' }}>📚</span>
        <span className="absolute text-4xl opacity-15 top-[15%] right-[12%] animate-float-reverse" style={{ animationDuration: '5s' }}>✏️</span>
        <span className="absolute text-3xl opacity-20 bottom-[20%] left-[8%] animate-float" style={{ animationDuration: '3.5s' }}>💡</span>
        <span className="absolute text-4xl opacity-15 bottom-[12%] right-[15%] animate-float-reverse" style={{ animationDuration: '4.5s' }}>🧠</span>
        <span className="absolute text-2xl opacity-20 top-[45%] left-[5%] animate-float-reverse" style={{ animationDuration: '5s' }}>📝</span>
        <span className="absolute text-2xl opacity-[0.18] top-[30%] right-[6%] animate-float" style={{ animationDuration: '3s' }}>🎓</span>
        <span className="absolute text-3xl opacity-[0.15] bottom-[35%] right-[30%] animate-float-reverse" style={{ animationDuration: '4s' }}>❓</span>
        <span className="absolute text-2xl opacity-[0.22] top-[65%] left-[25%] animate-float" style={{ animationDuration: '3.8s' }}>🏆</span>
        <span className="absolute text-3xl opacity-[0.15] top-[5%] left-[45%] animate-float-reverse" style={{ animationDuration: '4.2s' }}>⭐</span>
        <span className="absolute text-2xl opacity-[0.18] bottom-[8%] left-[40%] animate-float" style={{ animationDuration: '3.2s' }}>🔔</span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 shadow-sm relative overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400" />

          <div className="text-center mb-5 sm:mb-8">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎯</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Join a Quiz</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Enter the code shared by your teacher to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Quiz Code</label>
              <input
                type="text" placeholder="ABC123" value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={10}
                className="w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 text-gray-900 text-center text-xl sm:text-2xl font-mono tracking-[0.3em] placeholder-gray-200 focus:outline-none focus:border-black bg-gray-50 transition-colors"
              />
            </div>
            <button type="submit" disabled={isJoining || !joinCode.trim()}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors text-sm">
              {isJoining ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : 'Join Quiz'}
            </button>
          </form>

          <Link to="/student/dashboard" className="block text-center text-gray-400 hover:text-gray-600 mt-4 sm:mt-5 text-sm transition-colors">
            ← Back to Dashboard
          </Link>
        </div>

        {/* How it works */}
        <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { step: '1', text: 'Enter the code' },
            { step: '2', text: 'Wait for teacher' },
            { step: '3', text: 'Start the quiz!' },
          ].map((s, i) => (
            <div key={s.step} className="bg-white border border-gray-200 rounded-xl p-4 text-center animate-[fadeInUp_0.5s_ease-out_both]" style={{ animationDelay: `${400 + i * 120}ms` }}>
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold text-orange-500">{s.step}</span>
              </div>
              <p className="text-xs text-gray-500 font-semibold">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinQuiz;
