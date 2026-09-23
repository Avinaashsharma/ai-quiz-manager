const { generateQuizWithAI } = require('../services/aiService');

/**
 * @desc    Generate quiz questions using Gemini AI
 * @route   POST /api/ai/generate-quiz
 * @access  Private (teacher only)
 */
const generateQuiz = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can generate quizzes');
      error.statusCode = 403;
      return next(error);
    }

    const { topic, difficulty, numberOfQuestions } = req.body;

    if (!topic || !difficulty || !numberOfQuestions) {
      const error = new Error('Please provide topic, difficulty, and numberOfQuestions');
      error.statusCode = 400;
      return next(error);
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(difficulty)) {
      const error = new Error('Difficulty must be easy, medium, or hard');
      error.statusCode = 400;
      return next(error);
    }

    const numQ = parseInt(numberOfQuestions);
    if (isNaN(numQ) || numQ < 1 || numQ > 20) {
      const error = new Error('Number of questions must be between 1 and 20');
      error.statusCode = 400;
      return next(error);
    }

    const quizData = await generateQuizWithAI(topic, difficulty, numQ);

    res.status(200).json({
      success: true,
      message: 'Quiz generated successfully',
      data: quizData,
    });
  } catch (err) {
    console.error("GEMINI ERROR:", err)
    // Handle known validation errors from our service
    if (err.message && (
      err.message.includes('GEMINI_API_KEY') ||
      err.message.includes('AI returned') ||
      err.message.includes('AI response') ||
      err.message.includes('Question ')
    )) {
      const error = new Error(err.message);
      error.statusCode = 400;
      return next(error);
    }
    // Handle Gemini API errors (503, 429, etc.)
    if (err.status || (err.message && err.message.includes('"error"'))) {
      const error = new Error('AI service is temporarily unavailable. Please try again in a moment.');
      error.statusCode = 502;
      return next(error);
    }
    next(err);
  }
};

module.exports = { generateQuiz };
