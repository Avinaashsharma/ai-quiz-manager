import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import QuizForm, { emptyQuestion, type QuizFormData } from '../components/QuizForm';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI generation fields
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    duration: 10,
    status: 'draft',
    questions: [{ ...emptyQuestion, options: ['', '', '', ''] }],
  });

  const handleGenerate = async () => {
    setAiError('');
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/ai/generate-quiz', {
        topic: aiTopic,
        difficulty: aiDifficulty,
        numberOfQuestions: aiNumQuestions,
      });

      const data = res.data.data;
      setFormData({
        title: data.title,
        description: data.description || '',
        duration: formData.duration,
        status: formData.status,
        questions: data.questions,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setAiError(err.response.data.message);
      } else {
        setAiError('AI generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Quiz title is required');
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Question ${i + 1}, Option ${String.fromCharCode(65 + j)} is required`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      await api.post('/quizzes', formData);
      navigate('/teacher/quizzes');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create quiz');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <Link
            to="/teacher/quizzes"
            className="text-purple-300 hover:text-white text-sm transition-colors"
          >
            ← Back to Quizzes
          </Link>
        </div>

        {/* AI Generation Panel */}
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-1 flex items-center gap-2">
            ✨ Generate with AI
          </h2>
          <p className="text-purple-300 text-sm mb-4">
            Let Gemini AI create quiz questions for you. You can edit them before saving.
          </p>

          {aiError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              {aiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-purple-300 text-sm mb-1">Topic</label>
              <input
                type="text"
                placeholder="e.g. JavaScript Basics"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Difficulty</label>
              <select
                value={aiDifficulty}
                onChange={(e) => setAiDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
              >
                <option value="easy" className="text-gray-900">Easy</option>
                <option value="medium" className="text-gray-900">Medium</option>
                <option value="hard" className="text-gray-900">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-purple-300 text-sm mb-1">Questions</label>
              <input
                type="number"
                min={1}
                max={20}
                value={aiNumQuestions}
                onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-600/50 disabled:to-indigo-600/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-200"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating with AI...
              </span>
            ) : (
              '✨ Generate Quiz'
            )}
          </button>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-purple-400 text-sm mb-6">
            Edit the generated quiz below or create one manually, then save.
          </p>
        </div>

        <QuizForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Create Quiz"
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateQuiz;
