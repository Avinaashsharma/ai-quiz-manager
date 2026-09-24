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
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
          <Link to="/teacher/quizzes" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Back to Quizzes</Link>
        </div>
        <QuizForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" error={error} />
      </div>
    </div>
  );
};

export default EditQuiz;
