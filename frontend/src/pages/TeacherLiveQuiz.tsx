import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connectSocket, disconnectSocket } from '../services/socket';
import LiveLeaderboard from '../components/LiveLeaderboard';

interface Participant {
  userId: string;
  name: string;
}

const TeacherLiveQuiz: React.FC = () => {
  const { joinCode } = useParams<{ joinCode: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState('');

  interface LeaderboardEntry {
    userId: string;
    name: string;
    score: number;
    totalQuestions: number;
    percentage: number;
  }
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit('teacher:open-room', { joinCode });

    socket.on('room:opened', (data: { joinCode: string; participantCount: number; participants: Participant[]; leaderboard?: LeaderboardEntry[] }) => {
      setIsRoomOpen(true);
      setParticipantCount(data.participantCount);
      setParticipants(data.participants);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    });

    socket.on('room:participant-count', (data: { count: number; participants: Participant[] }) => {
      setParticipantCount(data.count);
      setParticipants(data.participants);
    });

    socket.on('quiz:started', () => {
      setQuizStarted(true);
    });

    socket.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    socket.on('leaderboard:updated', (data: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(data.leaderboard);
    });

    return () => {
      socket.off('room:opened');
      socket.off('room:participant-count');
      socket.off('quiz:started');
      socket.off('leaderboard:updated');
      socket.off('error');
      disconnectSocket();
    };
  }, [joinCode]);

  const handleStartQuiz = () => {
    const socket = connectSocket();
    socket.emit('teacher:start-quiz', { joinCode });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Live Quiz Room</h1>
            <p className="text-purple-300 text-sm">
              Join Code: <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">{joinCode}</span>
            </p>
          </div>
          <Link
            to="/teacher/quizzes"
            className="text-purple-300 hover:text-white text-sm transition-colors"
          >
            ← Back
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center mb-8">
          {!isRoomOpen ? (
            <p className="text-purple-300 text-lg">Connecting to room...</p>
          ) : quizStarted ? (
            <>
              <div className="text-5xl mb-3">🚀</div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Quiz In Progress</h2>
              <p className="text-purple-300">Students are now taking the quiz.</p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">⏳</div>
              <h2 className="text-2xl font-bold mb-2">Waiting for Students</h2>
              <p className="text-purple-300 mb-1">
                Share the join code with your students
              </p>
              <div className="text-6xl font-mono font-bold text-purple-400 tracking-widest my-6">
                {joinCode}
              </div>
            </>
          )}
        </div>

        {/* Participant Count */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              👥 Participants
              <span className="ml-2 text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-lg text-sm">
                {participantCount}
              </span>
            </h3>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          {participants.length === 0 ? (
            <p className="text-white/40 text-sm">No students have joined yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span
                  key={p.userId}
                  className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm"
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Start Button */}
        {isRoomOpen && !quizStarted && (
          <button
            onClick={handleStartQuiz}
            disabled={participantCount === 0}
            className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:bg-green-600/30 disabled:cursor-not-allowed rounded-xl text-lg font-bold transition-colors"
          >
            {participantCount === 0
              ? 'Waiting for students to join...'
              : `🚀 Start Quiz (${participantCount} student${participantCount !== 1 ? 's' : ''})`}
          </button>
        )}
        {/* Live Leaderboard (shown after quiz starts) */}
        {quizStarted && (
          <div className="mt-8">
            <LiveLeaderboard leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLiveQuiz;
