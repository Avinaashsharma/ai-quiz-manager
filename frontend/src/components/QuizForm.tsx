import React from 'react';

export interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizFormData {
  title: string;
  description: string;
  duration: number;
  status: string;
  questions: QuestionData[];
}

interface QuizFormProps {
  formData: QuizFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuizFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;
  error: string;
}

const emptyQuestion: QuestionData = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
};

const QuizForm: React.FC<QuizFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  submitLabel,
  error,
}) => {
  const updateQuestion = (index: number, field: keyof QuestionData, value: string | number | string[]) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[oIndex] = value;
      questions[qIndex] = { ...questions[qIndex], options };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...emptyQuestion, options: ['', '', '', ''] }],
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Quiz Details */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white mb-2">Quiz Details</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
        />
        <textarea
          placeholder="Description (optional)"
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors resize-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-300 text-sm mb-1">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={300}
              value={formData.duration}
              onChange={(e) => setFormData((p) => ({ ...p, duration: parseInt(e.target.value) || 1 }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-purple-300 text-sm mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
            >
              <option value="draft" className="text-gray-900">Draft</option>
              <option value="active" className="text-gray-900">Active</option>
              <option value="closed" className="text-gray-900">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions */}
      {formData.questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Question {qIndex + 1}</h3>
            {formData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                ✕ Remove
              </button>
            )}
          </div>

          <textarea
            placeholder="Enter question text"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors resize-none"
          />

          <div className="space-y-2">
            <label className="text-purple-300 text-sm">Options (select the correct one)</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    q.correctAnswer === oIndex
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'border-white/20 text-white/30 hover:border-white/40'
                  }`}
                >
                  {q.correctAnswer === oIndex ? '✓' : String.fromCharCode(65 + oIndex)}
                </button>
                <input
                  type="text"
                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Explanation (optional)"
            value={q.explanation}
            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={addQuestion}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors"
        >
          + Add Question
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
export { emptyQuestion };
