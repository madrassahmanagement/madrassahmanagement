const mongoose = require('mongoose');

const fitnessRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  activity: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  calories: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  weight: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  bmi: {
    type: Number,
    min: 0
  },
  createdBy: {
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
  }
});

// Update the updatedAt field before saving
fitnessRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
fitnessRecordSchema.index({ student: 1, date: -1 });
fitnessRecordSchema.index({ teacher: 1, date: -1 });
fitnessRecordSchema.index({ activity: 1 });
fitnessRecordSchema.index({ intensity: 1 });
fitnessRecordSchema.index({ className: 1 });

module.exports = mongoose.model('FitnessRecord', fitnessRecordSchema);
