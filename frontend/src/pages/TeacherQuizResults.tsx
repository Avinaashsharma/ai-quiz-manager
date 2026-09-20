import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

interface StudentAttempt {
  _id: string;
  student: { _id: string; name: string; email: string };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  submittedAt: string;
}

interface QuizStats {
  totalAttempts: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
}

interface QuizInfo {
  _id: string;
  title: string;
  totalQuestions: number;
}

const TeacherQuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<StudentAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'results' | 'leaderboard'>('results');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, leaderboardRes] = await Promise.all([
          api.get(`/quizzes/${id}/results`),
          api.get(`/quizzes/${id}/leaderboard`),
        ]);
        setQuiz(resultsRes.data.data.quiz);
        setStats(resultsRes.data.data.stats);
        setAttempts(resultsRes.data.data.attempts);
        setLeaderboard(leaderboardRes.data.data.leaderboard);
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
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <p className="text-red-300 text-xl mb-4">{error}</p>
        <Link to="/teacher/quizzes" className="px-6 py-3 bg-purple-600 rounded-xl font-semibold">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const scoreColor = (pct: number) =>
    pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{quiz?.title}</h1>
            <p className="text-purple-300 text-sm">Quiz Results & Leaderboard</p>
          </div>
          <Link
            to="/teacher/quizzes"
            className="text-purple-300 hover:text-white text-sm transition-colors"
          >
            ← Back to Quizzes
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold">{stats.totalAttempts}</p>
              <p className="text-purple-300 text-sm">Submissions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-purple-300">{stats.avgScore}%</p>
              <p className="text-purple-300 text-sm">Average</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-green-400">{stats.highestScore}%</p>
              <p className="text-purple-300 text-sm">Highest</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-red-400">{stats.lowestScore}%</p>
              <p className="text-purple-300 text-sm">Lowest</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('results')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'results'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setTab('leaderboard')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'leaderboard'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* Results Table */}
        {tab === 'results' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            {attempts.length === 0 ? (
              <p className="text-purple-300 text-center p-8">No submissions yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-purple-300 font-medium">Student</th>
                    <th className="text-center px-3 py-3 text-purple-300 font-medium">Score</th>
                    <th className="text-center px-3 py-3 text-purple-300 font-medium hidden md:table-cell">Correct</th>
                    <th className="text-center px-3 py-3 text-purple-300 font-medium hidden md:table-cell">Wrong</th>
                    <th className="text-center px-3 py-3 text-purple-300 font-medium">%</th>
                    <th className="text-right px-5 py-3 text-purple-300 font-medium hidden md:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a._id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-5 py-3">
                        <p className="font-medium">{a.student.name}</p>
                        <p className="text-white/40 text-xs">{a.student.email}</p>
                      </td>
                      <td className="text-center px-3 py-3">{a.score}/{a.totalQuestions}</td>
                      <td className="text-center px-3 py-3 text-green-400 hidden md:table-cell">{a.correctAnswers}</td>
                      <td className="text-center px-3 py-3 text-red-400 hidden md:table-cell">{a.wrongAnswers}</td>
                      <td className={`text-center px-3 py-3 font-bold ${scoreColor(a.percentage)}`}>{a.percentage}%</td>
                      <td className="text-right px-5 py-3 text-white/40 text-xs hidden md:table-cell">
                        {new Date(a.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="text-purple-300 text-center p-8">No submissions yet.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex items-center gap-4 px-5 py-4 ${
                      index < 3 ? 'bg-white/5' : ''
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                        index === 0
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : index === 1
                            ? 'bg-gray-400/30 text-gray-300'
                            : index === 2
                              ? 'bg-amber-700/30 text-amber-400'
                              : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{entry.student.name}</p>
                      <p className="text-white/40 text-xs">
                        {entry.correctAnswers}/{entry.totalQuestions} correct
                      </p>
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor(entry.percentage)}`}>
                      {entry.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuizResults;
