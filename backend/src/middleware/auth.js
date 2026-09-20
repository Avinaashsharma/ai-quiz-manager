const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to protect routes — verifies JWT from Authorization header.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized — no token provided');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('Not authorized — user not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    const error = new Error('Not authorized — invalid token');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { protect };
