const mongoose = require('mongoose');
const crypto = require('crypto');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: {
    type: [String],
    validate: {
      validator: (v) => v.length === 4,
      message: 'Each question must have exactly 4 options',
    },
    required: [true, 'Options are required'],
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be 0–3'],
    max: [3, 'Correct answer index must be 0–3'],
  },
  explanation: {
    type: String,
    default: '',
    trim: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description must be at most 1000 characters'],
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: 'A quiz must have at least 1 question',
      },
      required: [true, 'Questions are required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration (in minutes) is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [300, 'Duration must be at most 300 minutes'],
    },
    joinCode: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'active', 'closed'],
        message: 'Status must be draft, active, or closed',
      },
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique joinCode before saving (only on create)
quizSchema.pre('save', async function (next) {
  if (this.isNew && !this.joinCode) {
    let code;
    let exists = true;

    // Keep generating until we find a unique code
    while (exists) {
      code = crypto.randomBytes(3).toString('hex').toUpperCase();
      exists = await mongoose.models.Quiz.findOne({ joinCode: code });
    }

    this.joinCode = code;
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
