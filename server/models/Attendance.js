const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  // Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Class Information
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section: {
    type: String,
    required: true
  },
  
  // Date and Time
  date: {
    type: Date,
    required: true
  },
  checkInTime: Date,
  checkOutTime: Date,
  
  // Attendance Status
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused', 'sick'],
    required: true
  },
  
  // Late Arrival Details
  lateDetails: {
    isLate: {
      type: Boolean,
      default: false
    },
    lateMinutes: Number,
    reason: String
  },
  
  // Excuse Information
  excuse: {
    reason: String,
    documentation: String, // URL to uploaded document
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  },
  
  // Marked By
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notes
  notes: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ class: 1, section: 1, date: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });

// Compound index for unique attendance per student per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

// Method to calculate attendance percentage for a student
attendanceSchema.statics.calculateAttendancePercentage = async function(studentId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        student: mongoose.Types.ObjectId(studentId),
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: {
            $cond: [
              { $in: ['$status', ['present', 'late']] },
              1,
              0
            ]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  if (result.length === 0) return 0;
  
  const { totalDays, presentDays } = result[0];
  return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
};

// Method to get class attendance summary for a date
attendanceSchema.statics.getClassAttendanceSummary = async function(classId, section, date) {
  const pipeline = [
    {
      $match: {
        class: mongoose.Types.ObjectId(classId),
        section: section,
        date: date
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  const summary = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    sick: 0,
    total: 0
  };
  
  result.forEach(item => {
    summary[item._id] = item.count;
    summary.total += item.count;
  });
  
  return summary;
};

module.exports = mongoose.model('Attendance', attendanceSchema);
