const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Disable X-Powered-By header
app.disable('x-powered-by');

// --------------- Routes ---------------
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/attempts', attemptRoutes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
