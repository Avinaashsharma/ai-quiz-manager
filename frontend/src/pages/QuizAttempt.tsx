import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { connectSocket } from '../services/socket';

interface Question { _id: string; question: string; options: string[]; }
interface QuizData { _id: string; title: string; description: string; duration: number; questions: Question[]; }

const QuizAttempt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const locState = location.state as { quiz?: QuizData; joinCode?: string } | null;
  const quiz = locState?.quiz;
  const joinCode = locState?.joinCode;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(-1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quiz && timeLeft < 0) setTimeLeft(quiz.duration * 60);
  }, [quiz, timeLeft]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true); setError('');
    const answersArray = quiz.questions.map((q) => ({ questionId: q._id, selectedAnswer: answers[q._id] ?? -1 }));
    try {
      const res = await api.post('/attempts', { quizId: id, answers: answersArray });
      const attempt = res.data.data.attempt;
      if (joinCode) {
        try { const socket = connectSocket(); socket.emit('student:submit-score', { joinCode, score: attempt.score, totalQuestions: attempt.totalQuestions, percentage: attempt.percentage }); } catch { /* best-effort */ }
      }
      navigate(`/student/results/${attempt._id}`, { replace: true, state: { joinCode } });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) setError(err.response.data.message);
      else setError('Failed to submit quiz');
      setIsSubmitting(false);
    }
  }, [isSubmitting, quiz, answers, id, navigate, joinCode]);

  useEffect(() => {
    if (timeLeft <= 0) { if (timeLeft === 0 && quiz) handleSubmit(); return; }
    const timer = setInterval(() => { setTimeLeft((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz, handleSubmit]);

  if (!quiz) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-orange-50">
        <p className="text-gray-500 text-lg mb-4">No quiz data found.</p>
        <button onClick={() => navigate('/student/join')} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">Join a Quiz</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    if (seconds < 0) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (optionIndex: number) => { setAnswers((prev) => ({ ...prev, [currentQuestion._id]: optionIndex })); };
  const isUrgent = timeLeft >= 0 && timeLeft <= 60;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-400 text-sm">{answeredCount}/{totalQuestions} answered</p>
          </div>
          <div className={`text-xl font-mono font-bold px-4 py-2 rounded-lg border ${isUrgent ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-900'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">{error}</div>
        )}

        {/* Question Dots */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quiz.questions.map((q, i) => (
            <button key={q._id} onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                i === currentIndex ? 'bg-orange-500 text-white'
                : answers[q._id] !== undefined ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-white text-gray-400 border border-gray-200'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-6">
          <p className="text-orange-500 text-sm font-medium mb-2">Question {currentIndex + 1} of {totalQuestions}</p>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, oIndex) => (
              <button key={oIndex} onClick={() => selectAnswer(oIndex)}
                className={`w-full text-left px-5 py-3.5 rounded-lg border transition-all ${
                  answers[currentQuestion._id] === oIndex
                    ? 'bg-orange-50 border-orange-400 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-gray-300'
                }`}>
                <span className="font-semibold mr-3 text-orange-500">{String.fromCharCode(65 + oIndex)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}
            className="px-5 py-2.5 bg-white hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors">
            ← Previous
          </button>
          {currentIndex < totalQuestions - 1 ? (
            <button onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 border border-gray-300 rounded-lg font-medium text-gray-700 transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="px-8 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors">
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
