const express = require('express');
const router = express.Router();
const { generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate-quiz', protect, generateQuiz);

module.exports = router;
