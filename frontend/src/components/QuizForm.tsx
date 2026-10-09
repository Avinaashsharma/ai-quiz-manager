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

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all duration-200 text-sm';

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {/* Quiz Details Card */}
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-indigo-100 bg-gradient-to-r from-indigo-200 to-purple-200">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h2 className="font-semibold text-indigo-700 text-sm">Quiz Details</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gradient-to-br from-indigo-50/60 to-purple-50/60">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              placeholder="e.g. Chapter 5 – Photosynthesis Quiz"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description <span className="text-gray-400 font-normal normal-case">(optional)</span></label>
            <textarea
              placeholder="Brief description visible to students..."
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={300}
              value={formData.duration}
              onChange={(e) => setFormData((p) => ({ ...p, duration: parseInt(e.target.value) || 1 }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
              className={inputCls}
            >
              <option value="draft">📝 Draft</option>
              <option value="active">✅ Active</option>
              <option value="closed">🔒 Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 px-1">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">Questions <span className="inline-flex items-center justify-center text-sm font-bold bg-orange-500 text-white px-3 py-1 rounded-full shadow-sm shadow-orange-200">{formData.questions.length}</span></h2>
        </div>

        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white border border-teal-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Question Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-teal-100 bg-gradient-to-r from-teal-200 to-cyan-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/40 text-teal-800 text-xs font-bold flex items-center justify-center">{qIndex + 1}</span>
                <span className="font-semibold text-teal-800 text-sm">Question {qIndex + 1}</span>
              </div>
              {formData.questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  Remove
                </button>
              )}
            </div>

            <div className="p-5 space-y-4 bg-gradient-to-br from-teal-50/60 to-cyan-50/60">
              {/* Question Text */}
              <textarea
                placeholder="Enter your question here..."
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
              />

              {/* Options */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Options — click badge to mark correct answer</p>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                    q.correctAnswer === oIndex ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 text-xs font-bold ${
                        q.correctAnswer === oIndex
                          ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200'
                          : 'border-gray-300 text-gray-400 hover:border-orange-300 hover:text-orange-400'
                      }`}
                    >
                      {q.correctAnswer === oIndex ? '✓' : String.fromCharCode(65 + oIndex)}
                    </button>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Explanation <span className="font-normal normal-case">(optional)</span></label>
                <input
                  type="text"
                  placeholder="Why is this the correct answer?"
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-orange-50 text-gray-700 border border-gray-200 hover:border-orange-300 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm"
        >
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Question
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm"
        >
          {isSubmitting ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Saving...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{submitLabel}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
export { emptyQuestion };
