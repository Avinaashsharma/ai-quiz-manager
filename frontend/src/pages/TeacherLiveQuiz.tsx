import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connectSocket, disconnectSocket } from '../services/socket';
import LiveLeaderboard from '../components/LiveLeaderboard';

interface Participant { userId: string; name: string; }

const TeacherLiveQuiz: React.FC = () => {
  const { joinCode } = useParams<{ joinCode: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState('');

  interface LeaderboardEntry { userId: string; name: string; score: number; totalQuestions: number; percentage: number; }
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const socket = connectSocket();
    socket.emit('teacher:open-room', { joinCode });
    socket.on('room:opened', (data: { joinCode: string; participantCount: number; participants: Participant[]; leaderboard?: LeaderboardEntry[] }) => {
      setIsRoomOpen(true); setParticipantCount(data.participantCount); setParticipants(data.participants);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    });
    socket.on('room:participant-count', (data: { count: number; participants: Participant[] }) => { setParticipantCount(data.count); setParticipants(data.participants); });
    socket.on('quiz:started', () => { setQuizStarted(true); });
    socket.on('error', (data: { message: string }) => { setError(data.message); });
    socket.on('leaderboard:updated', (data: { leaderboard: LeaderboardEntry[] }) => { setLeaderboard(data.leaderboard); });
    return () => { socket.off('room:opened'); socket.off('room:participant-count'); socket.off('quiz:started'); socket.off('leaderboard:updated'); socket.off('error'); disconnectSocket(); };
  }, [joinCode]);

  const handleStartQuiz = () => { const socket = connectSocket(); socket.emit('teacher:start-quiz', { joinCode }); };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Quiz Room</h1>
            <p className="text-gray-500 text-sm mt-1">
              Join Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-900 font-medium">{joinCode}</span>
            </p>
          </div>
          <Link to="/teacher/quizzes" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Back</Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>
        )}

        {/* Status Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center mb-6">
          {!isRoomOpen ? (
            <p className="text-gray-400">Connecting to room...</p>
          ) : quizStarted ? (
            <>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🚀</span>
              </div>
              <h2 className="text-xl font-bold text-green-600 mb-1">Quiz In Progress</h2>
              <p className="text-gray-500 text-sm">Students are now taking the quiz.</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-500 text-xl">⏳</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Waiting for Students</h2>
              <p className="text-gray-500 text-sm mb-4">Share the join code with your students</p>
              <div className="text-5xl font-mono font-bold text-orange-500 tracking-widest">{joinCode}</div>
            </>
          )}
        </div>

        {/* Participants */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">
              Participants <span className="ml-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-xs">{participantCount}</span>
            </h3>
            <span className="text-green-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Live
            </span>
          </div>
          {participants.length === 0 ? (
            <p className="text-gray-400 text-sm">No students have joined yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span key={p.userId} className="bg-gray-50 border border-gray-200 px-3 py-1 rounded text-sm text-gray-700">{p.name}</span>
              ))}
            </div>
          )}
        </div>

        {/* Start Button */}
        {isRoomOpen && !quizStarted && (
          <button onClick={handleStartQuiz} disabled={participantCount === 0}
            className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-lg font-bold transition-colors">
            {participantCount === 0 ? 'Waiting for students...' : `Start Quiz (${participantCount} student${participantCount !== 1 ? 's' : ''})`}
          </button>
        )}

        {quizStarted && (
          <div className="mt-6">
            <LiveLeaderboard leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLiveQuiz;
