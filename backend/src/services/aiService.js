const { GoogleGenAI } = require('@google/genai');

/**
 * Generate quiz questions using Gemini AI.
 * @param {string} topic - The quiz topic
 * @param {string} difficulty - easy, medium, or hard
 * @param {number} numberOfQuestions - Number of questions to generate
 * @returns {object} { title, description, questions }
 */
const generateQuizWithAI = async (topic, difficulty, numberOfQuestions) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a quiz about "${topic}" with difficulty level "${difficulty}".
Create exactly ${numberOfQuestions} multiple-choice questions.

You MUST respond with ONLY valid JSON in this exact format, with no additional text, markdown, or code blocks:
{
  "title": "Quiz title about the topic",
  "description": "A brief description of the quiz",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why the correct answer is correct"
    }
  ]
}

Rules:
- Each question MUST have exactly 4 options.
- "correctAnswer" MUST be an integer from 0 to 3 (index of the correct option).
- All questions should be relevant to the topic "${topic}".
- Difficulty "${difficulty}" means: easy = basic recall, medium = understanding, hard = analysis/application.
- Return ONLY the JSON object, nothing else.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });

  const responseText = response.text.trim();

  // Strip markdown code blocks if present
  let jsonText = responseText;
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  // Validate structure
  if (!parsed.title || typeof parsed.title !== 'string') {
    throw new Error('AI response missing valid title');
  }
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('AI response missing valid questions array');
  }

  // Validate each question
  const validatedQuestions = parsed.questions.map((q, i) => {
    if (!q.question || typeof q.question !== 'string') {
      throw new Error(`Question ${i + 1} is missing question text`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${i + 1} must have exactly 4 options`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      throw new Error(`Question ${i + 1} has invalid correctAnswer (must be 0-3)`);
    }

    return {
      question: String(q.question),
      options: q.options.map(String),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ? String(q.explanation) : '',
    };
  });

  return {
    title: String(parsed.title),
    description: parsed.description ? String(parsed.description) : '',
    questions: validatedQuestions,
  };
};

module.exports = { generateQuizWithAI };
