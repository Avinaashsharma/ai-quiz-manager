const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

/**
 * @desc    Submit a quiz attempt
 * @route   POST /api/attempts
 * @access  Private (student only)
 */
const submitAttempt = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      const error = new Error('Only students can submit attempts');
      error.statusCode = 403;
      return next(error);
    }

    const { quizId, answers } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      const error = new Error('Please provide quizId and answers array');
      error.statusCode = 400;
      return next(error);
    }

    // Check if already attempted
    const existingAttempt = await Attempt.findOne({ quiz: quizId, student: req.user._id });
    if (existingAttempt) {
      const error = new Error('You have already attempted this quiz');
      error.statusCode = 400;
      return next(error);
    }

    // Get the quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.status !== 'active') {
      const error = new Error('This quiz is not currently active');
      error.statusCode = 400;
      return next(error);
    }

    // Grade the attempt
    let score = 0;
    const gradedAnswers = quiz.questions.map((question) => {
      const studentAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );
      const selectedAnswer = studentAnswer ? studentAnswer.selectedAnswer : -1;

      if (selectedAnswer === question.correctAnswer) {
        score++;
      }

      return {
        questionId: question._id,
        selectedAnswer: selectedAnswer,
      };
    });

    const totalQuestions = quiz.questions.length;
    const correctAnswers = score;
    const wrongAnswers = totalQuestions - score;
    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = await Attempt.create({
      quiz: quizId,
      student: req.user._id,
      answers: gradedAnswers,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attempt: {
          _id: attempt._id,
          score,
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          percentage,
          submittedAt: attempt.submittedAt,
        },
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('You have already attempted this quiz');
      error.statusCode = 400;
      return next(error);
    }
    if (err.kind === 'ObjectId') {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};

/**
 * @desc    Get attempt details with correct answers (for review)
 * @route   GET /api/attempts/:id
 * @access  Private (student who owns it)
 */
const getAttempt = async (req, res, next) => {
  try {
    const attempt = await Attempt.findById(req.params.id).populate({
      path: 'quiz',
      select: 'title description questions duration',
    });

    if (!attempt) {
      const error = new Error('Attempt not found');
      error.statusCode = 404;
      return next(error);
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view this attempt');
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: { attempt },
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      const error = new Error('Attempt not found');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};

/**
 * @desc    Get all attempts for the logged-in student
 * @route   GET /api/attempts
 * @access  Private (student only)
 */
const getMyAttempts = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      const error = new Error('Only students can view their attempts');
      error.statusCode = 403;
      return next(error);
    }

    const attempts = await Attempt.find({ student: req.user._id })
      .populate({ path: 'quiz', select: 'title description duration' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: { attempts },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all results for a specific quiz (teacher only)
 * @route   GET /api/quizzes/:id/results
 * @access  Private (quiz creator)
 */
const getQuizResults = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can view quiz results');
      error.statusCode = 403;
      return next(error);
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view results for this quiz');
      error.statusCode = 403;
      return next(error);
    }

    const attempts = await Attempt.find({ quiz: req.params.id })
      .populate({ path: 'student', select: 'name email' })
      .sort({ submittedAt: -1 });

    // Calculate quiz-level stats
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts)
      : 0;
    const highestScore = totalAttempts > 0
      ? Math.max(...attempts.map((a) => a.percentage))
      : 0;
    const lowestScore = totalAttempts > 0
      ? Math.min(...attempts.map((a) => a.percentage))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          totalQuestions: quiz.questions.length,
        },
        stats: { totalAttempts, avgScore, highestScore, lowestScore },
        attempts,
      },
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};

/**
 * @desc    Get leaderboard for a specific quiz (teacher only)
 * @route   GET /api/quizzes/:id/leaderboard
 * @access  Private (quiz creator)
 */
const getQuizLeaderboard = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can view leaderboard');
      error.statusCode = 403;
      return next(error);
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view leaderboard for this quiz');
      error.statusCode = 403;
      return next(error);
    }

    const leaderboard = await Attempt.find({ quiz: req.params.id })
      .populate({ path: 'student', select: 'name email' })
      .sort({ score: -1, submittedAt: 1 }) // Highest score first, earliest submission wins ties
      .select('student score totalQuestions correctAnswers wrongAnswers percentage submittedAt');

    res.status(200).json({
      success: true,
      data: {
        quiz: { _id: quiz._id, title: quiz.title },
        leaderboard,
      },
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
};

module.exports = { submitAttempt, getAttempt, getMyAttempts, getQuizResults, getQuizLeaderboard };
