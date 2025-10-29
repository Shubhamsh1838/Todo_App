const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Todo App API' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const connectDB = async () => {
  try {
     await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.log('Primary connection failed, trying local fallback...');
  }
};

// Start server
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    const reminderService = require('./services/reminderService');
    reminderService.start();
    console.log('Reminder service started');
  } else {
    console.log('Starting server without database (limited functionality)');
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
