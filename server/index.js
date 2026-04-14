const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const User = require('./models/User');    
const Message = require('./models/Message'); 
const Event = require('./models/Event');
const Joi = require('joi');
const { generateHostResponse } = require('./controllers/aiController');
const { initHostScheduler } = require('./services/hostScheduler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.set('io', io); // Attach io to app
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing Environment Variables (MONGO_URI or JWT_SECRET).');
  process.exit(1);
}

// Initialize Host Scheduler
initHostScheduler(io);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Virtual Event Platform!');
});

// Socket.io Authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error('Authentication failed'));

    const decoded = await authMiddleware.verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error('User not found'));

    socket.user = { userId: user._id, role: user.role };
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a private room for (Attendee, Admin, Event)
  socket.on('join_room', ({ attendeeId, eventId }) => {
    const roomId = `room_${attendeeId}_${eventId}`;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined ${roomId}`);
  });

  // Fetch full history
  socket.on('fetch_history', async ({ attendeeId, eventId }) => {
    try {
      const messages = await Message.find({ eventId, $or: [{ sender: attendeeId }, { receiver: attendeeId }] }).sort({ timestamp: 1 });
      socket.emit('history', messages);
    } catch (error) {
      console.error('History Error:', error);
    }
  });

  // Send message
  socket.on('send_message', async (data) => {
    const schema = Joi.object({
      receiverId: Joi.string().required(),
      eventId: Joi.string().required(),
      content: Joi.string().max(1000).required()
    });

    const { error, value } = schema.validate(data);
    if (error) {
      return socket.emit('chat-error', { message: error.details[0].message });
    }

    const { receiverId, eventId, content } = value;

    try {
      const attendeeId = socket.user.role === 'admin' ? receiverId : socket.user.userId;
      const roomId = `room_${attendeeId}_${eventId}`;

      const newMessage = new Message({
        sender: socket.user.userId,
        receiver: receiverId,
        eventId,
        content
      });

      await newMessage.save();
      io.to(roomId).emit('message', newMessage);

      // AI Host Feature: Trigger on direct @host mention, or any content starting with '@'
      if (receiverId === 'ai_host' || content.trim().startsWith('@') || content.toLowerCase().includes('@host')) {
        const cleanContent = content.startsWith('@') ? content.split(' ').slice(1).join(' ') : content;
        
        // Notify client AI is thinking
        io.to(roomId).emit('ai_typing', { isTyping: true });

        // Fetch Event Context
        const eventData = await Event.findById(eventId);
        const eventDescription = eventData ? `Event: ${eventData.title}. Description: ${eventData.description}. Date: ${eventData.date}.` : "";
        
        // Fetch recent conversation history (last 10 messages)
        const history = await Message.find({ 
          eventId, 
          $or: [
            { sender: socket.user.userId, receiver: 'ai_host' },
            { sender: 'ai_host', receiver: socket.user.userId }
          ]
        }).sort({ timestamp: -1 }).limit(10);
        
        // Format history for AI
        const formattedHistory = history.reverse().map(m => `${m.sender === 'ai_host' ? 'AI' : 'User'}: ${m.content}`).join('\n');

        const aiResponse = await generateHostResponse(cleanContent, eventDescription, formattedHistory);
        
        const aiMessage = new Message({
          sender: 'ai_host', 
          receiver: socket.user.userId,
          eventId,
          content: aiResponse
        });
        await aiMessage.save();
        
        io.to(roomId).emit('ai_typing', { isTyping: false });
        io.to(roomId).emit('message', aiMessage);
      }
    } catch (error) {
      console.error('Send Error:', error);
      socket.emit('chat-error', { message: 'Failed to send message.' });
    }
  });

  // Action event for 3D Avatar
  socket.on('avatar_action', (data) => {
    const schema = Joi.object({
      eventId: Joi.string().required(),
      action: Joi.string().valid('idle', 'wave', 'greet', 'point', 'shout').required()
    });
    const { error, value } = schema.validate(data);
    if (error) return;

    io.to(`event_${value.eventId}`).emit('host-action', value);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Mongo Error:', err.message);
    process.exit(1);
  }
};

startServer();
