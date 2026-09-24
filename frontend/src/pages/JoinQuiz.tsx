import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import axios from 'axios';

interface QuizData {
  _id: string; title: string; description: string; duration: number;
  questions: { _id: string; question: string; options: string[] }[];
}

const JoinQuiz: React.FC = () => {
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const navigate = useNavigate();

  const handleQuizStart = useCallback(
    (data: { quiz: QuizData }) => {
      navigate(`/student/quiz/${data.quiz._id}/attempt`, { state: { quiz: data.quiz, joinCode: joinCode.toUpperCase() } });
    }, [navigate, joinCode]
  );

  useEffect(() => { return () => { disconnectSocket(); }; }, []);

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
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-500 text-xl">⏳</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Waiting for Teacher</h2>
          <p className="text-gray-500 text-sm mb-6">You&apos;ve joined the quiz room. The quiz will start when your teacher is ready.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-400 text-xs mb-1">Room Code</p>
            <p className="text-3xl font-mono font-bold text-orange-500 tracking-widest">{joinCode}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {participantCount} student{participantCount !== 1 ? 's' : ''} connected
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-md shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Join Quiz</h2>
        <p className="text-gray-500 text-sm text-center mb-6">Enter the code provided by your teacher</p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Enter Join Code" value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={10}
            className="w-full px-4 py-4 rounded-lg border border-gray-300 text-gray-900 text-center text-2xl font-mono tracking-widest placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase"
          />
          <button type="submit" disabled={isJoining}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors">
            {isJoining ? 'Joining...' : 'Join Quiz'}
          </button>
        </form>
        <Link to="/student/dashboard" className="block text-center text-gray-500 hover:text-gray-700 mt-6 text-sm">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default JoinQuiz;
