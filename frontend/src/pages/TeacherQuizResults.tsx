import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

interface StudentAttempt {
  _id: string; student: { _id: string; name: string; email: string };
  score: number; totalQuestions: number; correctAnswers: number; wrongAnswers: number; percentage: number; submittedAt: string;
}
interface QuizStats { totalAttempts: number; avgScore: number; highestScore: number; lowestScore: number; }
interface QuizInfo { _id: string; title: string; totalQuestions: number; }

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
        const [resultsRes, leaderboardRes] = await Promise.all([api.get(`/quizzes/${id}/results`), api.get(`/quizzes/${id}/leaderboard`)]);
        setQuiz(resultsRes.data.data.quiz); setStats(resultsRes.data.data.stats);
        setAttempts(resultsRes.data.data.attempts); setLeaderboard(leaderboardRes.data.data.leaderboard);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
        else setError('Failed to load results');
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50"><p className="text-gray-400">Loading results...</p></div>;
  if (error) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-gray-50">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <Link to="/teacher/quizzes" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold">Back to Quizzes</Link>
    </div>
  );

  const scoreColor = (pct: number) => pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-orange-500' : 'text-red-500';
  const medalColor = (i: number) => {
    if (i === 0) return 'bg-yellow-100 text-yellow-700';
    if (i === 1) return 'bg-gray-100 text-gray-600';
    if (i === 2) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-50 text-gray-400';
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
            <p className="text-gray-500 text-sm">Results & Leaderboard</p>
          </div>
          <Link to="/teacher/quizzes" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Back to Quizzes</Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              <p className="text-gray-500 text-xs">Submissions</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.avgScore}%</p>
              <p className="text-gray-500 text-xs">Average</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.highestScore}%</p>
              <p className="text-gray-500 text-xs">Highest</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{stats.lowestScore}%</p>
              <p className="text-gray-500 text-xs">Lowest</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          <button onClick={() => setTab('results')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'results' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            All Results
          </button>
          <button onClick={() => setTab('leaderboard')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'leaderboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            🏆 Leaderboard
          </button>
        </div>

        {/* Results Table */}
        {tab === 'results' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {attempts.length === 0 ? (
              <p className="text-gray-400 text-center p-8">No submissions yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Student</th>
                    <th className="text-center px-3 py-3 text-gray-500 font-medium">Score</th>
                    <th className="text-center px-3 py-3 text-gray-500 font-medium hidden md:table-cell">Correct</th>
                    <th className="text-center px-3 py-3 text-gray-500 font-medium hidden md:table-cell">Wrong</th>
                    <th className="text-center px-3 py-3 text-gray-500 font-medium">%</th>
                    <th className="text-right px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{a.student.name}</p>
                        <p className="text-gray-400 text-xs">{a.student.email}</p>
                      </td>
                      <td className="text-center px-3 py-3 text-gray-700">{a.score}/{a.totalQuestions}</td>
                      <td className="text-center px-3 py-3 text-green-600 hidden md:table-cell">{a.correctAnswers}</td>
                      <td className="text-center px-3 py-3 text-red-500 hidden md:table-cell">{a.wrongAnswers}</td>
                      <td className={`text-center px-3 py-3 font-bold ${scoreColor(a.percentage)}`}>{a.percentage}%</td>
                      <td className="text-right px-5 py-3 text-gray-400 text-xs hidden md:table-cell">{new Date(a.submittedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="text-gray-400 text-center p-8">No submissions yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {leaderboard.map((entry, index) => (
                  <div key={entry._id} className={`flex items-center gap-4 px-5 py-4 ${index < 3 ? 'bg-gray-50/50' : ''}`}>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${medalColor(index)}`}>{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.student.name}</p>
                      <p className="text-gray-400 text-xs">{entry.correctAnswers}/{entry.totalQuestions} correct</p>
                    </div>
                    <span className={`text-xl font-bold ${scoreColor(entry.percentage)}`}>{entry.percentage}%</span>
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
