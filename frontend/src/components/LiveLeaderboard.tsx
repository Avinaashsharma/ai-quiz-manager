import React from 'react';

interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

interface LiveLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ leaderboard, currentUserId }) => {
  if (leaderboard.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
        <p className="text-white/40 text-sm">No scores yet. Waiting for submissions...</p>
      </div>
    );
  }

  const medalStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/30';
    if (index === 1) return 'bg-gray-400/30 text-gray-300 border-gray-400/30';
    if (index === 2) return 'bg-amber-700/30 text-amber-400 border-amber-700/30';
    return 'bg-white/5 text-white/40 border-white/10';
  };

  const scoreColor = (pct: number) =>
    pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          🏆 Live Leaderboard
        </h3>
        <span className="text-green-400 text-xs flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {leaderboard.map((entry, index) => {
          const isMe = currentUserId === entry.userId;
          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isMe ? 'bg-purple-500/10' : ''
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${medalStyle(index)}`}
              >
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isMe ? 'text-purple-300' : ''}`}>
                  {entry.name}
                  {isMe && <span className="ml-1 text-xs text-purple-400">(You)</span>}
                </p>
                <p className="text-white/40 text-xs">
                  {entry.score}/{entry.totalQuestions} correct
                </p>
              </div>
              <span className={`text-xl font-bold ${scoreColor(entry.percentage)}`}>
                {entry.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveLeaderboard;
