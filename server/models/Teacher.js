const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  employeeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  joinDate: {
    type: Date,
    required: true
  },
  subjects: [{
    type: String,
    trim: true
  }],
  classes: [{
    type: String,
    trim: true
  }],
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  salary: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  performance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  attendancePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

// Update the updatedAt field before saving
teacherSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ employeeNumber: 1 });
teacherSchema.index({ status: 1 });
teacherSchema.index({ user: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);