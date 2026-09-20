const Quiz = require('../models/Quiz');

/**
 * @desc    Create a new quiz
 * @route   POST /api/quizzes
 * @access  Private (teacher only)
 */
const createQuiz = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can create quizzes');
      error.statusCode = 403;
      return next(error);
    }

    const { title, description, questions, duration, status } = req.body;

    if (!title || !questions || !duration) {
      const error = new Error('Please provide title, questions, and duration');
      error.statusCode = 400;
      return next(error);
    }

    const quiz = await Quiz.create({
      title,
      description,
      questions,
      duration,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: { quiz },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      const error = new Error(messages.join(', '));
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

/**
 * @desc    Get all quizzes for the logged-in teacher
 * @route   GET /api/quizzes
 * @access  Private (teacher only)
 */
const getQuizzes = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can access this route');
      error.statusCode = 403;
      return next(error);
    }

    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-questions');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: { quizzes },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  Private (teacher who owns it)
 */
const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view this quiz');
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: { quiz },
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
 * @desc    Update a quiz
 * @route   PUT /api/quizzes/:id
 * @access  Private (teacher who owns it)
 */
const updateQuiz = async (req, res, next) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this quiz');
      error.statusCode = 403;
      return next(error);
    }

    const { title, description, questions, duration, status } = req.body;

    if (title !== undefined) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions !== undefined) quiz.questions = questions;
    if (duration !== undefined) quiz.duration = duration;
    if (status !== undefined) quiz.status = status;

    quiz = await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: { quiz },
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      const error = new Error(messages.join(', '));
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
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Private (teacher who owns it)
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      const error = new Error('Quiz not found');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.createdBy.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this quiz');
      error.statusCode = 403;
      return next(error);
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
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
 * @desc    Join a quiz using joinCode (students only)
 * @route   POST /api/quizzes/join
 * @access  Private (student only)
 */
const joinQuiz = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      const error = new Error('Only students can join quizzes');
      error.statusCode = 403;
      return next(error);
    }

    const { joinCode } = req.body;
    if (!joinCode) {
      const error = new Error('Please provide a join code');
      error.statusCode = 400;
      return next(error);
    }

    const quiz = await Quiz.findOne({ joinCode: joinCode.toUpperCase() });
    if (!quiz) {
      const error = new Error('Invalid join code');
      error.statusCode = 404;
      return next(error);
    }

    if (quiz.status !== 'active') {
      const error = new Error('This quiz is not currently active');
      error.statusCode = 400;
      return next(error);
    }

    // Check if student already attempted this quiz
    const Attempt = require('../models/Attempt');
    const existingAttempt = await Attempt.findOne({ quiz: quiz._id, student: req.user._id });
    if (existingAttempt) {
      const error = new Error('You have already attempted this quiz');
      error.statusCode = 400;
      return next(error);
    }

    // Return quiz WITHOUT correctAnswer and explanation
    const safeQuestions = quiz.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          questions: safeQuestions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz, joinQuiz };
