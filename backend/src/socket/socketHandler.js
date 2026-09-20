const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// Track rooms: { joinCode: { teacher: socketId, students: Map<socketId, { userId, name }>, quizId, leaderboard: [] } }
const rooms = new Map();

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = { _id: user._id.toString(), name: user.name, role: user.role };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] ${socket.user.name} (${socket.user.role}) connected`);

    // ---------- Teacher: Create/Open a quiz room ----------
    socket.on('teacher:open-room', async ({ joinCode }) => {
      try {
        if (socket.user.role !== 'teacher') {
          return socket.emit('error', { message: 'Only teachers can open rooms' });
        }

        const quiz = await Quiz.findOne({ joinCode: joinCode.toUpperCase() });
        if (!quiz) {
          return socket.emit('error', { message: 'Quiz not found' });
        }

        if (quiz.createdBy.toString() !== socket.user._id) {
          return socket.emit('error', { message: 'Not your quiz' });
        }

        const code = joinCode.toUpperCase();
        socket.join(code);

        if (!rooms.has(code)) {
          rooms.set(code, {
            teacher: socket.id,
            students: new Map(),
            quizId: quiz._id.toString(),
            leaderboard: [],
          });
        } else {
          rooms.get(code).teacher = socket.id;
        }

        const room = rooms.get(code);
        socket.emit('room:opened', {
          joinCode: code,
          participantCount: room.students.size,
          participants: Array.from(room.students.values()),
          leaderboard: room.leaderboard,
        });

        console.log(`[Socket] Teacher opened room ${code}`);
      } catch (err) {
        socket.emit('error', { message: err.message || 'Failed to open room' });
      }
    });

    // ---------- Student: Join a quiz room ----------
    socket.on('student:join-room', ({ joinCode }) => {
      if (socket.user.role !== 'student') {
        return socket.emit('error', { message: 'Only students can join rooms' });
      }

      const code = joinCode.toUpperCase();
      const room = rooms.get(code);

      if (!room) {
        return socket.emit('error', { message: 'Room not found. Wait for teacher to open it.' });
      }

      socket.join(code);
      socket.quizRoom = code;

      room.students.set(socket.id, {
        userId: socket.user._id,
        name: socket.user.name,
      });

      // Notify student
      socket.emit('room:joined', {
        joinCode: code,
        participantCount: room.students.size,
        leaderboard: room.leaderboard,
      });

      // Broadcast updated count to entire room
      io.to(code).emit('room:participant-count', {
        count: room.students.size,
        participants: Array.from(room.students.values()),
      });

      console.log(`[Socket] ${socket.user.name} joined room ${code} (${room.students.size} students)`);
    });

    // ---------- Teacher: Start the quiz ----------
    socket.on('teacher:start-quiz', async ({ joinCode }) => {
      try {
        if (socket.user.role !== 'teacher') {
          return socket.emit('error', { message: 'Only teachers can start quizzes' });
        }

        const code = joinCode.toUpperCase();
        const room = rooms.get(code);

        if (!room || room.teacher !== socket.id) {
          return socket.emit('error', { message: 'You are not the teacher of this room' });
        }

        // Fetch quiz without correct answers for students
        const quiz = await Quiz.findById(room.quizId);
        if (!quiz) {
          return socket.emit('error', { message: 'Quiz not found' });
        }

        const safeQuestions = quiz.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          options: q.options,
        }));

        const quizData = {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          questions: safeQuestions,
        };

        // Broadcast to all students in the room
        io.to(code).emit('quiz:started', { quiz: quizData });

        console.log(`[Socket] Quiz started in room ${code} for ${room.students.size} students`);
      } catch (err) {
        socket.emit('error', { message: err.message || 'Failed to start quiz' });
      }
    });

    // ---------- Student: Submit score (after REST submission) ----------
    socket.on('student:submit-score', ({ joinCode, score, totalQuestions, percentage }) => {
      if (socket.user.role !== 'student') return;

      const code = joinCode?.toUpperCase() || socket.quizRoom;
      if (!code) return;

      const room = rooms.get(code);
      if (!room) return;

      // Add or update in leaderboard
      const existing = room.leaderboard.find((e) => e.userId === socket.user._id);
      if (existing) {
        existing.score = score;
        existing.totalQuestions = totalQuestions;
        existing.percentage = percentage;
      } else {
        room.leaderboard.push({
          userId: socket.user._id,
          name: socket.user.name,
          score,
          totalQuestions,
          percentage,
        });
      }

      // Sort by score descending, then by name ascending for ties
      room.leaderboard.sort((a, b) => {
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        return a.name.localeCompare(b.name);
      });

      // Broadcast updated leaderboard to entire room
      io.to(code).emit('leaderboard:updated', { leaderboard: room.leaderboard });

      console.log(`[Socket] ${socket.user.name} submitted score ${score}/${totalQuestions} in room ${code}`);
    });

    // ---------- Handle disconnect ----------
    socket.on('disconnect', () => {
      console.log(`[Socket] ${socket.user.name} disconnected`);

      // If student, remove from room participants (but keep leaderboard entry)
      if (socket.quizRoom) {
        const room = rooms.get(socket.quizRoom);
        if (room) {
          room.students.delete(socket.id);

          // Broadcast updated count
          io.to(socket.quizRoom).emit('room:participant-count', {
            count: room.students.size,
            participants: Array.from(room.students.values()),
          });

          // Clean up empty rooms (no students and no teacher connected)
          if (room.students.size === 0 && !io.sockets.adapter.rooms.get(socket.quizRoom)) {
            rooms.delete(socket.quizRoom);
            console.log(`[Socket] Room ${socket.quizRoom} cleaned up`);
          }
        }
      }
    });
  });
};

module.exports = { setupSocket };
