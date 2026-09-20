import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface Summary {
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averagePercentage: number;
  totalCorrect: number;
  totalWrong: number;
}

interface ScoreBucket { range: string; count: number }
interface QuestionAcc {
  questionNumber: number;
  questionText: string;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
}
interface StudentPerf {
  name: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
}
interface QuizInfo { _id: string; title: string; totalQuestions: number }

const COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#818cf8', '#c084fc'];
const PIE_COLORS = ['#22c55e', '#ef4444'];

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
        setQuiz(d.quiz);
        setSummary(d.summary);
        setScoreDistribution(d.scoreDistribution);
        setQuestionAccuracy(d.questionAccuracy);
        setStudentPerformance(d.studentPerformance);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load analytics');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <p className="text-red-300 text-xl mb-4">{error}</p>
        <Link to="/teacher/quizzes" className="px-6 py-3 bg-purple-600 rounded-xl font-semibold">Back to Quizzes</Link>
      </div>
    );
  }

  const pieData = summary
    ? [
        { name: 'Correct', value: summary.totalCorrect },
        { name: 'Wrong', value: summary.totalWrong },
      ]
    : [];

  const isEmpty = !summary || summary.totalParticipants === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{quiz?.title}</h1>
            <p className="text-purple-300 text-sm">Quiz Analytics</p>
          </div>
          <Link to="/teacher/quizzes" className="text-purple-300 hover:text-white text-sm transition-colors">← Back to Quizzes</Link>
        </div>

        {isEmpty ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">No Data Yet</h2>
            <p className="text-purple-300">Analytics will appear once students start submitting their attempts.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold">{summary!.totalParticipants}</p>
                <p className="text-purple-300 text-sm">Participants</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-purple-400">{summary!.averagePercentage}%</p>
                <p className="text-purple-300 text-sm">Avg Score</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-green-400">{summary!.highestScore}%</p>
                <p className="text-purple-300 text-sm">Highest</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-red-400">{summary!.lowestScore}%</p>
                <p className="text-purple-300 text-sm">Lowest</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Score Distribution */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="range" tick={{ fill: '#a78bfa', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#a78bfa', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {scoreDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Correct vs Wrong Pie */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Overall Correct vs Wrong</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ color: '#a78bfa', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Question Accuracy */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Question-wise Accuracy</h3>
              <ResponsiveContainer width="100%" height={Math.max(200, questionAccuracy.length * 45)}>
                <BarChart data={questionAccuracy} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a78bfa', fontSize: 12 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="questionNumber"
                    tick={{ fill: '#a78bfa', fontSize: 12 }}
                    tickFormatter={(v: number) => `Q${v}`}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Student Performance */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Student Performance</h3>
              <ResponsiveContainer width="100%" height={Math.max(250, studentPerformance.length * 45)}>
                <BarChart data={studentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#a78bfa', fontSize: 12 }} unit="%" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#a78bfa', fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1e1b4b', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [
                      `${value}${name === 'percentage' ? '%' : ''}`,
                      name === 'percentage' ? 'Score' : name,
                    ]}
                  />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                    {studentPerformance.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.percentage >= 80 ? '#22c55e' : entry.percentage >= 50 ? '#eab308' : '#ef4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherAnalytics;
