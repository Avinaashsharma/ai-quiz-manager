import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';
import { connectSocket } from '../services/socket';

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface QuizData {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
}

const QuizAttempt: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const locState = location.state as { quiz?: QuizData; joinCode?: string } | null;
  const quiz = locState?.quiz;
  const joinCode = locState?.joinCode;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(-1); // -1 = not initialized
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize timer once when quiz data is available
  useEffect(() => {
    if (quiz && timeLeft < 0) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz, timeLeft]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);
    setError('');

    const answersArray = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: answers[q._id] ?? -1,
    }));

    try {
      const res = await api.post('/attempts', {
        quizId: id,
        answers: answersArray,
      });
      const attempt = res.data.data.attempt;

      // Emit score to socket for live leaderboard
      if (joinCode) {
        try {
          const socket = connectSocket();
          socket.emit('student:submit-score', {
            joinCode,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            percentage: attempt.percentage,
          });
        } catch { /* socket emit is best-effort */ }
      }

      navigate(`/student/results/${attempt._id}`, { replace: true, state: { joinCode } });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to submit quiz');
      }
      setIsSubmitting(false);
    }
  }, [isSubmitting, quiz, answers, id, navigate, joinCode]);

  // Timer countdown — only runs when timeLeft > 0
  useEffect(() => {
    // timeLeft === -1 means not initialized, timeLeft === 0 means expired
    if (timeLeft <= 0) {
      // Auto-submit only when timer reaches exactly 0 (was counting down)
      if (timeLeft === 0 && quiz) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, handleSubmit]);

  // Redirect if no quiz data
  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <p className="text-xl mb-4">No quiz data found.</p>
        <button
          onClick={() => navigate('/student/join')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
        >
          Join a Quiz
        </button>
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

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion._id]: optionIndex }));
  };

  const isUrgent = timeLeft <= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <p className="text-purple-300 text-sm">
              {answeredCount}/{totalQuestions} answered
            </p>
          </div>
          <div
            className={`text-2xl font-mono font-bold px-4 py-2 rounded-xl border ${
              isUrgent
                ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                : 'bg-white/10 border-white/20'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Question Dots */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quiz.questions.map((q, i) => (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(i)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-purple-600 text-white'
                  : answers[q._id] !== undefined
                    ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                    : 'bg-white/10 text-white/60 border border-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 mb-6">
          <p className="text-purple-400 text-sm mb-2">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => selectAnswer(oIndex)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  answers[currentQuestion._id] === oIndex
                    ? 'bg-purple-600/30 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="font-semibold mr-3 text-purple-400">
                  {String.fromCharCode(65 + oIndex)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 rounded-xl font-medium transition-colors"
          >
            ← Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
