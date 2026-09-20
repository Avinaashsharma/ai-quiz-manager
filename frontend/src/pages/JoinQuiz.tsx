import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import axios from 'axios';

interface QuizData {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: { _id: string; question: string; options: string[] }[];
}

const JoinQuiz: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const navigate = useNavigate();

  // Navigate to quiz attempt when quiz starts via socket
  const handleQuizStart = useCallback(
    (data: { quiz: QuizData }) => {
      navigate(`/student/quiz/${data.quiz._id}/attempt`, {
        state: { quiz: data.quiz, joinCode: joinCode.toUpperCase() },
      });
    },
    [navigate, joinCode]
  );

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!joinCode.trim()) {
      setError('Please enter a join code');
      return;
    }

    setIsJoining(true);
    try {
      // Validate via REST API first (checks quiz exists, is active, not already attempted)
      await api.post('/quizzes/join', { joinCode: joinCode.trim() });

      // Connect to socket room
      const socket = connectSocket();

      socket.on('room:joined', (data: { participantCount: number }) => {
        setWaitingRoom(true);
        setParticipantCount(data.participantCount);
        setIsJoining(false);
      });

      socket.on('room:participant-count', (data: { count: number }) => {
        setParticipantCount(data.count);
      });

      socket.on('quiz:started', handleQuizStart);

      socket.on('error', (data: { message: string }) => {
        setError(data.message);
        setWaitingRoom(false);
        setIsJoining(false);
      });

      socket.emit('student:join-room', { joinCode: joinCode.trim() });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to join quiz');
      }
      setIsJoining(false);
    }
  };

  // Waiting room view
  if (waitingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-white mb-2">Waiting for Teacher</h2>
          <p className="text-purple-300 text-sm mb-6">
            You&apos;ve joined the quiz room. The quiz will start when your teacher is ready.
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-white/50 text-sm">Room Code</p>
            <p className="text-3xl font-mono font-bold text-purple-400 tracking-widest">{joinCode}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-purple-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{participantCount} student{participantCount !== 1 ? 's' : ''} connected</span>
          </div>
        </div>
      </div>
    );
  }

  // Join form view
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Join Quiz</h2>
        <p className="text-purple-300 text-center text-sm mb-6">
          Enter the join code provided by your teacher
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Join Code (e.g. A1B2C3)"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={10}
            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl font-mono tracking-widest placeholder-white/30 focus:outline-none focus:border-purple-400 transition-colors uppercase"
          />
          <button
            type="submit"
            disabled={isJoining}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            {isJoining ? 'Joining...' : 'Join Quiz'}
          </button>
        </form>

        <Link
          to="/student/dashboard"
          className="block text-center text-white/50 hover:text-white/80 mt-6 text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default JoinQuiz;
