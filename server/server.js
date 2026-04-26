const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const Consultation = require('./models/Consultation');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/consultations', consultationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'RuralCare360 API is running successfully',
    version: '1.0.0'
  });
});

// ── Socket.io Real-Time Chat ──────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join a consultation room
  socket.on('joinConsultation', (consultationId) => {
    socket.join(consultationId);
    console.log(`User joined consultation room: ${consultationId}`);
  });

  // Send and receive messages
  socket.on('sendMessage', async (data) => {
    const { consultationId, senderId, message } = data;
    try {
      const consultation = await Consultation.findById(consultationId);
      if (consultation) {
        consultation.messages.push({
          sender: senderId,
          message: message
        });
        await consultation.save();

        // Broadcast to everyone in the room
        io.to(consultationId).emit('receiveMessage', {
          senderId,
          message,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Message error:', error.message);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.consultationId).emit('userTyping', {
      userId: data.userId
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  });