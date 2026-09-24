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
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-400 text-sm">No scores yet. Waiting for submissions...</p>
      </div>
    );
  }

  const medalColor = (i: number) => {
    if (i === 0) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (i === 1) return 'bg-gray-100 text-gray-600 border-gray-300';
    if (i === 2) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-gray-50 text-gray-500 border-gray-200';
  };

  const scoreColor = (pct: number) =>
    pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">🏆 Live Leaderboard</h3>
        <span className="text-green-500 text-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {leaderboard.map((entry, index) => {
          const isMe = currentUserId === entry.userId;
          return (
            <div key={entry.userId} className={`flex items-center gap-3 px-5 py-3 ${isMe ? 'bg-orange-50/50' : ''}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${medalColor(index)}`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isMe ? 'text-orange-700' : 'text-gray-900'}`}>
                  {entry.name}
                  {isMe && <span className="ml-1 text-xs text-orange-500">(You)</span>}
                </p>
                <p className="text-gray-400 text-xs">{entry.score}/{entry.totalQuestions} correct</p>
              </div>
              <span className={`text-lg font-bold ${scoreColor(entry.percentage)}`}>{entry.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveLeaderboard;
