const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

/**
 * @desc    Get detailed analytics for a quiz
 * @route   GET /api/quizzes/:id/analytics
 * @access  Private (quiz creator only)
 */
const getQuizAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      const error = new Error('Only teachers can view analytics');
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
      const error = new Error('Not authorized to view analytics for this quiz');
      error.statusCode = 403;
      return next(error);
    }

    const attempts = await Attempt.find({ quiz: req.params.id })
      .populate({ path: 'student', select: 'name email' })
      .sort({ submittedAt: -1 });

    const totalParticipants = attempts.length;

    if (totalParticipants === 0) {
      return res.status(200).json({
        success: true,
        data: {
          quiz: { _id: quiz._id, title: quiz.title, totalQuestions: quiz.questions.length },
          summary: {
            totalParticipants: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            averagePercentage: 0,
            totalCorrect: 0,
            totalWrong: 0,
          },
          scoreDistribution: [],
          questionAccuracy: [],
          studentPerformance: [],
        },
      });
    }

    // Summary stats
    const scores = attempts.map((a) => a.percentage);
    const averagePercentage = Math.round(scores.reduce((s, v) => s + v, 0) / totalParticipants);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const totalCorrect = attempts.reduce((s, a) => s + a.correctAnswers, 0);
    const totalWrong = attempts.reduce((s, a) => s + a.wrongAnswers, 0);
    const averageScore = parseFloat(
      (attempts.reduce((s, a) => s + a.score, 0) / totalParticipants).toFixed(1)
    );

    // Score distribution (buckets: 0-20, 21-40, 41-60, 61-80, 81-100)
    const buckets = [
      { range: '0-20%', min: 0, max: 20, count: 0 },
      { range: '21-40%', min: 21, max: 40, count: 0 },
      { range: '41-60%', min: 41, max: 60, count: 0 },
      { range: '61-80%', min: 61, max: 80, count: 0 },
      { range: '81-100%', min: 81, max: 100, count: 0 },
    ];
    scores.forEach((s) => {
      const bucket = buckets.find((b) => s >= b.min && s <= b.max);
      if (bucket) bucket.count++;
    });
    const scoreDistribution = buckets.map((b) => ({ range: b.range, count: b.count }));

    // Question-wise accuracy
    const questionAccuracy = quiz.questions.map((q, index) => {
      let correct = 0;
      let total = 0;

      attempts.forEach((attempt) => {
        const answer = attempt.answers.find(
          (a) => a.questionId.toString() === q._id.toString()
        );
        if (answer) {
          total++;
          if (answer.selectedAnswer === q.correctAnswer) {
            correct++;
          }
        }
      });

      return {
        questionNumber: index + 1,
        questionText: q.question.length > 50 ? q.question.substring(0, 50) + '...' : q.question,
        correctCount: correct,
        wrongCount: total - correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });

    // Student performance (for bar chart)
    const studentPerformance = attempts.map((a) => ({
      name: a.student.name,
      score: a.score,
      percentage: a.percentage,
      correctAnswers: a.correctAnswers,
      wrongAnswers: a.wrongAnswers,
    }));

    res.status(200).json({
      success: true,
      data: {
        quiz: { _id: quiz._id, title: quiz.title, totalQuestions: quiz.questions.length },
        summary: {
          totalParticipants,
          averageScore,
          highestScore,
          lowestScore,
          averagePercentage,
          totalCorrect,
          totalWrong,
        },
        scoreDistribution,
        questionAccuracy,
        studentPerformance,
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

module.exports = { getQuizAnalytics };
