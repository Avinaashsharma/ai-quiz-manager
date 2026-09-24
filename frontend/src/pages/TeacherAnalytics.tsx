import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface Summary {
  totalParticipants: number; averageScore: number; highestScore: number; lowestScore: number;
  averagePercentage: number; totalCorrect: number; totalWrong: number;
}
interface ScoreBucket { range: string; count: number }
interface QuestionAcc { questionNumber: number; questionText: string; correctCount: number; wrongCount: number; accuracy: number; }
interface StudentPerf { name: string; score: number; percentage: number; correctAnswers: number; wrongAnswers: number; }
interface QuizInfo { _id: string; title: string; totalQuestions: number }

const BAR_COLORS = ['#f97316', '#ea580c', '#fb923c', '#fdba74', '#c2410c'];
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
        setQuiz(d.quiz); setSummary(d.summary); setScoreDistribution(d.scoreDistribution);
        setQuestionAccuracy(d.questionAccuracy); setStudentPerformance(d.studentPerformance);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
        else setError('Failed to load analytics');
      } finally { setIsLoading(false); }
    };
    fetchAnalytics();
  }, [id]);

  if (isLoading) return <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50"><p className="text-gray-400">Loading analytics...</p></div>;
  if (error) return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-gray-50">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <Link to="/teacher/quizzes" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold">Back to Quizzes</Link>
    </div>
  );

  const pieData = summary ? [{ name: 'Correct', value: summary.totalCorrect }, { name: 'Wrong', value: summary.totalWrong }] : [];
  const isEmpty = !summary || summary.totalParticipants === 0;

  const tooltipStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, color: '#374151', fontSize: 13 };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
            <p className="text-gray-500 text-sm">Analytics</p>
          </div>
          <Link to="/teacher/quizzes" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Back to Quizzes</Link>
        </div>

        {isEmpty ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-3xl mb-3">📊</p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h2>
            <p className="text-gray-500">Analytics will appear once students start submitting their attempts.</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{summary!.totalParticipants}</p>
                <p className="text-gray-500 text-xs">Participants</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">{summary!.averagePercentage}%</p>
                <p className="text-gray-500 text-xs">Avg Score</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{summary!.highestScore}%</p>
                <p className="text-gray-500 text-xs">Highest</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{summary!.lowestScore}%</p>
                <p className="text-gray-500 text-xs">Lowest</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="range" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {scoreDistribution.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Correct vs Wrong</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={({ name, percent }: any) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 13, color: '#6b7280' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Question Accuracy */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Question-wise Accuracy</h3>
              <ResponsiveContainer width="100%" height={Math.max(200, questionAccuracy.length * 45)}>
                <BarChart data={questionAccuracy} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="questionNumber" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v: number) => `Q${v}`} width={40} />
                  <Tooltip contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value}%`, 'Accuracy']} />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Student Performance */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Student Performance</h3>
              <ResponsiveContainer width="100%" height={Math.max(250, studentPerformance.length * 45)}>
                <BarChart data={studentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} width={100} />
                  <Tooltip contentStyle={tooltipStyle}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [`${value}${name === 'percentage' ? '%' : ''}`, name === 'percentage' ? 'Score' : name]} />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                    {studentPerformance.map((entry, i) => (
                      <Cell key={i} fill={entry.percentage >= 80 ? '#22c55e' : entry.percentage >= 50 ? '#f97316' : '#ef4444'} />
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
