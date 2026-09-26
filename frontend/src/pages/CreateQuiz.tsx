import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import QuizForm, { emptyQuestion, type QuizFormData } from '../components/QuizForm';

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const [formData, setFormData] = useState<QuizFormData>({
    title: '', description: '', duration: 10, status: 'draft',
    questions: [{ ...emptyQuestion, options: ['', '', '', ''] }],
  });

  const handleGenerate = async () => {
    setAiError('');
    if (!aiTopic.trim()) { setAiError('Please enter a topic'); return; }
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/generate-quiz', { topic: aiTopic, difficulty: aiDifficulty, numberOfQuestions: aiNumQuestions });
      const data = res.data.data;
      setFormData({ title: data.title, description: data.description || '', duration: formData.duration, status: formData.status, questions: data.questions });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setAiError(err.response.data.message);
      else setAiError('AI generation failed. Please try again.');
    } finally { setIsGenerating(false); }
  };

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
    try { await api.post('/quizzes', formData); navigate('/teacher/quizzes'); }
    catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to create quiz');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
          <Link to="/teacher/quizzes" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Back to Quizzes</Link>
        </div>

        {/* AI Generation Panel */}
        <div className="bg-white border border-orange-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-500">✨</span>
            <h2 className="font-semibold text-gray-900">Generate with AI</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">Let Gemini AI create quiz questions for you. You can edit them before saving.</p>

          {aiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm text-center">{aiError}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text" placeholder="e.g. JavaScript Basics" value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
              <input type="number" min={1} max={20} value={aiNumQuestions}
                onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <button type="button" onClick={handleGenerate} disabled={isGenerating}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors">
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Generating...
              </span>
            ) : '✨ Generate Quiz'}
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-6">Edit the generated quiz below or create one manually, then save.</p>

        <QuizForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Quiz" error={error} />
      </div>
    </div>
  );
};

export default CreateQuiz;
