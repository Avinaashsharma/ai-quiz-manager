const express = require('express');
const router = express.Router();
const {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  joinQuiz,
} = require('../controllers/quizController');
const { getQuizResults, getQuizLeaderboard } = require('../controllers/attemptController');
const { getQuizAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All quiz routes are protected
router.use(protect);

router.post('/join', joinQuiz);
router.route('/').post(createQuiz).get(getQuizzes);
router.route('/:id').get(getQuiz).put(updateQuiz).delete(deleteQuiz);
router.get('/:id/results', getQuizResults);
router.get('/:id/leaderboard', getQuizLeaderboard);
router.get('/:id/analytics', getQuizAnalytics);

module.exports = router;
