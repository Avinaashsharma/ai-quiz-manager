import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

interface Summary {
  totalParticipants: number; averageScore: number; highestScore: number; lowestScore: number;
  averagePercentage: number; totalCorrect: number; totalWrong: number;
}
interface ScoreBucket { range: string; count: number }
interface QuestionAcc { questionNumber: number; questionText: string; correctCount: number; wrongCount: number; accuracy: number; }
interface StudentPerf { name: string; score: number; percentage: number; correctAnswers: number; wrongAnswers: number; }
interface QuizInfo { _id: string; title: string; totalQuestions: number }

const GRADIENT_COLORS = {
  bar: ['#f97316', '#fb923c'],
  area: ['#f97316', '#fdba74'],
  green: '#10b981',
  red: '#ef4444',
  orange: '#f97316',
};


const TeacherAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreBucket[]>([]);
  const [questionAccuracy, setQuestionAccuracy] = useState<QuestionAcc[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/quizzes/${id}/analytics`);
        const d = res.data.data;
        setQuiz(d.quiz); setSummary(d.summary); setScoreDistribution(d.scoreDistribution);
        setQuestionAccuracy(d.questionAccuracy); setStudentPerformance(d.studentPerformance);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
        else setError('Failed to load analytics');
      } finally { setIsLoading(false); }
    };
    fetchAnalytics();
  }, [id]);

  if (isLoading) return <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-orange-50"><p className="text-gray-400">Loading analytics...</p></div>;
  if (error) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-orange-50">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <Link to="/teacher/quizzes" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold">Back to Quizzes</Link>
    </div>
  );

  const pieData = summary ? [{ name: 'Correct', value: summary.totalCorrect }, { name: 'Wrong', value: summary.totalWrong }] : [];
  const isEmpty = !summary || summary.totalParticipants === 0;

  const tooltipStyle = {
    background: 'rgba(255,255,255,0.96)',
    border: 'none',
    borderRadius: 12,
    color: '#1f2937',
    fontSize: 13,
    fontWeight: 500,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '10px 14px',
  };

  const passRate = summary ? Math.round((studentPerformance.filter(s => s.percentage >= 50).length / summary.totalParticipants) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">Quiz Analytics</p>
            <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{quiz?.totalQuestions} questions · {summary?.totalParticipants ?? 0} participants</p>
          </div>
          <Link to="/teacher/quizzes" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">
            ← Back
          </Link>
        </div>

        {isEmpty ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-3xl mb-3">📊</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h2>
            <p className="text-gray-500">Analytics will appear once students start submitting their attempts.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-[40px] -mr-2 -mt-2" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Participants</p>
                <p className="text-3xl font-bold text-gray-900">{summary!.totalParticipants}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-[40px] -mr-2 -mt-2" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Avg Score</p>
                <p className="text-3xl font-bold text-orange-500">{summary!.averagePercentage}<span className="text-lg">%</span></p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-[40px] -mr-2 -mt-2" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Highest</p>
                <p className="text-3xl font-bold text-green-600">{summary!.highestScore}<span className="text-lg">%</span></p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-[40px] -mr-2 -mt-2" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Lowest</p>
                <p className="text-3xl font-bold text-red-500">{summary!.lowestScore}<span className="text-lg">%</span></p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[40px] -mr-2 -mt-2" />
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Pass Rate</p>
                <p className="text-3xl font-bold text-gray-900">{passRate}<span className="text-lg">%</span></p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
              {/* Score Distribution — wider */}
              <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 text-sm">Score Distribution</h3>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{scoreDistribution.reduce((s, b) => s + b.count, 0)} students</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={scoreDistribution}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GRADIENT_COLORS.orange} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={GRADIENT_COLORS.orange} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(249,115,22,0.04)' }} />
                    <Area type="monotone" dataKey="count" stroke={GRADIENT_COLORS.orange} strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 4, fill: '#fff', stroke: GRADIENT_COLORS.orange, strokeWidth: 2 }} activeDot={{ r: 6, fill: GRADIENT_COLORS.orange }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Correct vs Wrong — donut */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-gray-900 text-sm">Correct vs Wrong</h3>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                    </defs>
                    <Pie data={pieData} cx="50%" cy="45%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value" cornerRadius={6}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                    >
                      <Cell fill="url(#greenGrad)" />
                      <Cell fill="url(#redGrad)" />
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: '#6b7280', paddingTop: 8 }}
                      formatter={(value: string) => <span className="text-gray-600 text-xs font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Accuracy */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 text-sm">Question-wise Accuracy</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{questionAccuracy.length} questions</span>
              </div>
              <div className="space-y-3">
                {questionAccuracy.map((q) => {
                  const color = q.accuracy >= 80 ? 'bg-green-500' : q.accuracy >= 50 ? 'bg-orange-400' : 'bg-red-400';
                  const colorText = q.accuracy >= 80 ? 'text-green-600' : q.accuracy >= 50 ? 'text-orange-500' : 'text-red-500';
                  return (
                    <div key={q.questionNumber} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">Q{q.questionNumber}</span>
                          <p className="text-sm text-gray-700 truncate" title={q.questionText}>{q.questionText}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="text-xs text-gray-400">{q.correctCount}✓ {q.wrongCount}✗</span>
                          <span className={`text-sm font-bold ${colorText} min-w-[40px] text-right`}>{q.accuracy}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${q.accuracy}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Performance */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900 text-sm">Student Performance</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{studentPerformance.length} students</span>
              </div>
              <div className="space-y-3">
                {studentPerformance.map((s, i) => {
                  const color = s.percentage >= 80 ? 'bg-green-500' : s.percentage >= 50 ? 'bg-orange-400' : 'bg-red-400';
                  const badge = s.percentage >= 80 ? 'bg-green-50 text-green-700' : s.percentage >= 50 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700';
                  const label = s.percentage >= 80 ? 'Excellent' : s.percentage >= 50 ? 'Good' : 'Needs Work';
                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                          <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 ml-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>{label}</span>
                          <span className="text-xs text-gray-400">{s.correctAnswers}/{s.correctAnswers + s.wrongAnswers}</span>
                          <span className="text-sm font-bold text-gray-900 min-w-[40px] text-right">{s.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalytics;
