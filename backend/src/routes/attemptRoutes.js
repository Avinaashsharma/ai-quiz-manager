const express = require('express');
const router = express.Router();
const { submitAttempt, getAttempt, getMyAttempts } = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(submitAttempt).get(getMyAttempts);
router.route('/:id').get(getAttempt);

module.exports = router;
