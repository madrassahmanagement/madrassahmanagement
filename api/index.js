const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/madrassah_mms';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('../server/routes/auth');
const studentsRoutes = require('../server/routes/students');
const teachersRoutes = require('../server/routes/teachers');
const attendanceRoutes = require('../server/routes/attendance');
const namazRoutes = require('../server/routes/namaz');
const islamicStudiesRoutes = require('../server/routes/islamicStudies');
const disciplineRoutes = require('../server/routes/discipline');
const fitnessRoutes = require('../server/routes/fitness');
const classesRoutes = require('../server/routes/classes');
const reportsRoutes = require('../server/routes/reports');
const adminRoutes = require('../server/routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/namaz', namazRoutes);
app.use('/api/islamic-studies', islamicStudiesRoutes);
app.use('/api/discipline', disciplineRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
