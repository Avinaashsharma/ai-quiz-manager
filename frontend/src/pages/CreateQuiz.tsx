import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-[calc(100vh-56px)] relative" style={{backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(circle, #c0bfcf 1.5px, transparent 1.5px)', backgroundSize: '24px 24px'}}>
      {/* Colored tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-transparent to-teal-50/60 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-200 to-cyan-200 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Create Quiz</h1>
              <p className="text-xs text-gray-400 mt-0.5">Build manually or generate with AI</p>
            </div>
          </div>
        </div>


        {/* AI Generation Panel */}
        <div className="relative bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 border border-teal-200 rounded-2xl p-6 sm:py-10 mb-6 shadow-sm overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl" />

          {/* Floating icons */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <span className="absolute text-5xl opacity-40 top-[8%] left-[5%] animate-float" style={{animationDuration:'4s'}}>✨</span>
            <span className="absolute text-5xl opacity-35 top-[10%] right-[8%] animate-float-reverse" style={{animationDuration:'5s'}}>🤖</span>
            <span className="absolute text-4xl opacity-40 bottom-[12%] left-[8%] animate-float" style={{animationDuration:'3.5s'}}>🧠</span>
            <span className="absolute text-4xl opacity-35 bottom-[10%] right-[6%] animate-float-reverse" style={{animationDuration:'4.5s'}}>💡</span>
            <span className="absolute text-4xl opacity-40 top-[45%] left-[2%] animate-float-reverse" style={{animationDuration:'5s'}}>⚡</span>
            <span className="absolute text-4xl opacity-35 top-[40%] right-[3%] animate-float" style={{animationDuration:'3s'}}>🎯</span>
            <span className="absolute text-3xl opacity-30 top-[30%] left-[30%] animate-float" style={{animationDuration:'6s'}}>🚀</span>
            <span className="absolute text-3xl opacity-30 bottom-[30%] right-[25%] animate-float-reverse" style={{animationDuration:'4.8s'}}>⭐</span>
          </div>

          <div className="relative flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-teal-200 flex items-center justify-center text-lg">✨</div>
            <h2 className="font-bold text-teal-800 text-lg">Generate with AI</h2>
          </div>
          <p className="relative text-teal-700 text-sm mb-5">Let Gemini AI create quiz questions for you. You can edit them before saving.</p>

          {aiError && (
            <div className="relative mb-5 flex justify-center animate-[fadeInUp_0.25s_ease-out_both]">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/95 backdrop-blur-md border border-rose-200 text-rose-700 px-4 py-2 rounded-full shadow-md shadow-rose-200/40 text-xs sm:text-sm max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="font-semibold text-rose-800">{aiError}</span>
                <button
                  type="button"
                  onClick={() => setAiError('')}
                  className="ml-1 text-rose-400 hover:text-rose-700 rounded-full p-0.5 hover:bg-rose-100 transition-colors shrink-0"
                  aria-label="Dismiss error"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1.5">Topic</label>
              <input
                type="text" placeholder="e.g. JavaScript Basics" value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1.5">Difficulty</label>
              <div className="flex gap-2 sm:gap-4">
                {[
                  { value: 'easy',   label: 'Easy',   emoji: '😊', desc: 'Beginner', active: 'bg-gradient-to-b from-green-400 to-green-600 text-white border-green-500 shadow-lg shadow-green-200 scale-105',   inactive: 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400' },
                  { value: 'medium', label: 'Medium', emoji: '🤔', desc: 'Moderate', active: 'bg-gradient-to-b from-yellow-400 to-orange-500 text-white border-orange-400 shadow-lg shadow-yellow-200 scale-105', inactive: 'bg-white text-yellow-700 border-2 border-yellow-200 hover:border-yellow-400' },
                  { value: 'hard',   label: 'Hard',   emoji: '🔥', desc: 'Advanced', active: 'bg-gradient-to-b from-red-400 to-red-600 text-white border-red-500 shadow-lg shadow-red-200 scale-105',           inactive: 'bg-white text-red-700 border-2 border-red-200 hover:border-red-400' },
                ].map(d => (
                  <button key={d.value} type="button" onClick={() => setAiDifficulty(d.value)}
                    className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-3 rounded-2xl font-bold transition-all duration-200 ${aiDifficulty === d.value ? d.active : d.inactive}`}>
                    {aiDifficulty === d.value && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/30 rounded-full flex items-center justify-center text-[10px]">✓</span>
                    )}
                    <span className="text-2xl">{d.emoji}</span>
                    <span className="text-xs font-bold">{d.label}</span>
                    <span className={`text-[10px] font-normal ${aiDifficulty === d.value ? 'text-white/80' : 'text-gray-400'}`}>{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1.5">Questions</label>
              <input type="number" min={1} max={20} value={aiNumQuestions}
                onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-300 bg-white text-gray-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 shadow-sm transition-all"
              />
            </div>
          </div>
          <div className="relative flex justify-center mt-4 sm:mt-10">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto min-w-[240px] sm:min-w-[420px] px-8 sm:px-16 py-2.5 bg-white hover:bg-violet-50 disabled:bg-white/50 disabled:cursor-not-allowed text-violet-600 font-bold rounded-xl transition-all duration-200 text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                '✨ Generate Quiz'
              )}
            </button>
          </div>

          {/* Fallback Note on bottom-left - light compact responsive note */}
          <div className="relative mt-8 sm:mt-16 flex items-start sm:items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-amber-900/80 bg-white/50 border border-amber-200/60 px-2 py-0.5 sm:px-2.5 rounded-md w-fit max-w-full">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-[10px] sm:text-xs leading-tight sm:leading-normal">
              <strong className="font-semibold text-amber-900 mr-1">Note:</strong>
              In case AI fails to generate questions due to technical issues or quota limits, you will need to add questions manually below.
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6">Edit the generated quiz below or create one manually, then save.</p>

        <QuizForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Quiz" error={error} />
      </div>
    </div>
  );
};

export default CreateQuiz;
