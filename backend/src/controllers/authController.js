const crypto = require('crypto');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendOtpEmail } = require('../services/emailService');

/**
 * Generate a 6-digit OTP string.
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * @desc    Register a new user (sends OTP, does NOT log in)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      const error = new Error('Please provide name, email, password, and role');
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but is NOT verified, allow re-registration (resend OTP)
      if (!existingUser.isVerified) {
        const otp = generateOtp();
        existingUser.otp = otp;
        existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        existingUser.name = name;
        existingUser.password = password; // will be re-hashed by pre-save hook
        existingUser.role = role;
        await existingUser.save();

        await sendOtpEmail(email, name, otp);

        return res.status(200).json({
          success: true,
          message: 'A verification code has been sent to your email.',
          data: { email, requiresVerification: true },
        });
      }

      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      return next(error);
    }

    // Generate OTP
    const otp = generateOtp();

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    await sendOtpEmail(email, name, otp);

    res.status(201).json({
      success: true,
      message: 'A verification code has been sent to your email.',
      data: { email, requiresVerification: true },
    });
  } catch (err) {
    // Handle mongoose validation errors
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
 * @desc    Verify OTP and activate account
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error = new Error('Please provide email and OTP');
      error.statusCode = 400;
      return next(error);
    }

    // Find user and include otp fields
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email already verified. You can log in.',
      });
    }

    // Check OTP exists
    if (!user.otp || !user.otpExpires) {
      const error = new Error('No OTP found. Please request a new one.');
      error.statusCode = 400;
      return next(error);
    }

    // Check expiry
    if (user.otpExpires < new Date()) {
      const error = new Error('OTP has expired. Please request a new one.');
      error.statusCode = 400;
      return next(error);
    }

    // Compare OTP
    if (user.otp !== otp.toString().trim()) {
      const error = new Error('Incorrect OTP. Please try again.');
      error.statusCode = 400;
      return next(error);
    }

    // Mark as verified, clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token — user is now logged in
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};


/**
 * @desc    Login user (only verified users)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Block unverified users
    if (!user.isVerified) {
      const error = new Error('Please verify your email before logging in.');
      error.statusCode = 403;
      return next(error);
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyOtp, login, getMe };
