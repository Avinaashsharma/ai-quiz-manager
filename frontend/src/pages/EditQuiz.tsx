import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import QuizForm, { type QuizFormData } from '../components/QuizForm';

const EditQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<QuizFormData>({
    title: '', description: '', duration: 10, status: 'draft', questions: [],
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const quiz = res.data.data.quiz;
        setFormData({
          title: quiz.title, description: quiz.description || '', duration: quiz.duration, status: quiz.status,
          questions: quiz.questions.map((q: { question: string; options: string[]; correctAnswer: number; explanation?: string }) => ({
            question: q.question, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation || '',
          })),
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
        else setError('Failed to load quiz');
      } finally { setIsLoading(false); }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) { setError('Quiz title is required'); return; }
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) { setError(`Question ${i + 1} text is required`); return; }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) { setError(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} is required`); return; }
      }
    }
    setIsSubmitting(true);
    try { await api.put(`/quizzes/${id}`, formData); navigate('/teacher/quizzes'); }
    catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to update quiz');
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-orange-50">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-3.536.884.884-3.536A4 4 0 019 13z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Edit Quiz</h1>
              <p className="text-xs text-gray-400 mt-0.5">Make changes and save when ready</p>
            </div>
          </div>
          <Link to="/teacher/quizzes" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-xl transition-all shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Quizzes
          </Link>
        </div>
        <QuizForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} />
      </div>
    </div>
  );
};

export default EditQuiz;
