const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { register, verifyOtp, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limit auth endpoints: 20 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);

module.exports = router;
