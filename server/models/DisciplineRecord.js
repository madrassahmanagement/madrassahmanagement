const mongoose = require('mongoose');

const disciplineRecordSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['positive', 'negative'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated'],
    default: 'active'
  },
  resolution: {
    type: String,
    trim: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedDate: {
    type: Date
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
disciplineRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
disciplineRecordSchema.index({ student: 1, date: -1 });
disciplineRecordSchema.index({ teacher: 1, date: -1 });
disciplineRecordSchema.index({ type: 1 });
disciplineRecordSchema.index({ status: 1 });
disciplineRecordSchema.index({ className: 1 });

module.exports = mongoose.model('DisciplineRecord', disciplineRecordSchema);
