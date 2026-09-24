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

const QuizForm: React.FC<QuizFormProps> = ({ formData, setFormData, onSubmit, isSubmitting, submitLabel, error }) => {
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
    setFormData((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">{error}</div>
      )}

      {/* Quiz Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quiz Details</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            placeholder="Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            placeholder="Brief description"
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
            <input
              type="number"
              min={1}
              max={300}
              value={formData.duration}
              onChange={(e) => setFormData((p) => ({ ...p, duration: parseInt(e.target.value) || 1 }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions */}
      {formData.questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Question {qIndex + 1}</h3>
            {formData.questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                Remove
              </button>
            )}
          </div>
          <textarea
            placeholder="Enter question text"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Options (click to mark correct)</label>
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors text-sm font-medium ${
                    q.correctAnswer === oIndex
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {q.correctAnswer === oIndex ? '✓' : String.fromCharCode(65 + oIndex)}
                </button>
                <input
                  type="text"
                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Explanation (optional)"
            value={q.explanation}
            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={addQuestion}
          className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
        >
          + Add Question
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
export { emptyQuestion };
