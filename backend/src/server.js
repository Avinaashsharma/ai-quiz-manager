require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { setupSocket } = require('./socket/socketHandler');

const PORT = process.env.PORT || 5000;

// Validate critical environment variables at startup
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key].startsWith('your_')) {
    console.error(`FATAL: Environment variable ${key} is not configured. Set it in .env`);
    process.exit(1);
  }
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server and attach Socket.IO
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // Setup Socket.IO handlers
    setupSocket(io);

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Socket.IO enabled`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
