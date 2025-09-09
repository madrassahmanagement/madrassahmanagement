const mongoose = require('mongoose');

const disciplineSchema = new mongoose.Schema({
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
  
  // Date
  date: {
    type: Date,
    required: true
  },
  
  // Behavior Points
  behaviorPoints: {
    positive: {
      type: Number,
      default: 0,
      min: 0
    },
    negative: {
      type: Number,
      default: 0,
      min: 0
    },
    net: {
      type: Number,
      default: 0
    }
  },
  
  // Behavior Records
  behaviorRecords: [{
    type: {
      type: String,
      enum: ['positive', 'negative'],
      required: true
    },
    category: {
      type: String,
      enum: [
        'punctuality', 'attendance', 'namaz', 'quran_recitation', 'respect', 'helpfulness',
        'disruption', 'disrespect', 'late_arrival', 'missed_namaz', 'poor_performance', 'other'
      ],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Teacher Satisfaction
  teacherSatisfaction: {
    level: {
      type: String,
      enum: ['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'],
      default: 'satisfied'
    },
    score: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    remarks: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  
  // Discipline Actions
  actions: [{
    type: {
      type: String,
      enum: ['warning', 'counseling', 'parent_notification', 'detention', 'suspension', 'other'],
      required: true
    },
    description: String,
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    takenAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled'],
      default: 'active'
    }
  }],
  
  // Daily Summary
  summary: {
    overallBehavior: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor', 'concerning'],
      default: 'good'
    },
    improvementAreas: [String],
    strengths: [String],
    recommendations: String
  },
  
  // Parent Communication
  parentCommunication: {
    notified: {
      type: Boolean,
      default: false
    },
    notificationType: {
      type: String,
      enum: ['email', 'sms', 'phone', 'in_person']
    },
    notificationSentAt: Date,
    parentResponse: String,
    parentResponseAt: Date
  },
  
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
disciplineSchema.index({ student: 1, date: 1 });
disciplineSchema.index({ class: 1, section: 1, date: 1 });
disciplineSchema.index({ date: 1 });
disciplineSchema.index({ 'behaviorPoints.net': 1 });
disciplineSchema.index({ 'teacherSatisfaction.score': 1 });

// Compound index for unique record per student per day
disciplineSchema.index({ student: 1, date: 1 }, { unique: true });

// Pre-save middleware to calculate net points and overall behavior
disciplineSchema.pre('save', function(next) {
  // Calculate net points
  this.behaviorPoints.net = this.behaviorPoints.positive - this.behaviorPoints.negative;
  
  // Calculate overall behavior based on net points and teacher satisfaction
  const netPoints = this.behaviorPoints.net;
  const satisfactionScore = this.teacherSatisfaction.score;
  
  if (netPoints >= 5 && satisfactionScore >= 4) {
    this.summary.overallBehavior = 'excellent';
  } else if (netPoints >= 2 && satisfactionScore >= 3) {
    this.summary.overallBehavior = 'good';
  } else if (netPoints >= -2 && satisfactionScore >= 2) {
    this.summary.overallBehavior = 'average';
  } else if (netPoints >= -5 && satisfactionScore >= 1) {
    this.summary.overallBehavior = 'poor';
  } else {
    this.summary.overallBehavior = 'concerning';
  }
  
  next();
});

// Method to add behavior record
disciplineSchema.methods.addBehaviorRecord = function(type, category, description, points, recordedBy) {
  const record = {
    type,
    category,
    description,
    points,
    recordedBy,
    time: new Date()
  };
  
  this.behaviorRecords.push(record);
  
  if (type === 'positive') {
    this.behaviorPoints.positive += points;
  } else {
    this.behaviorPoints.negative += points;
  }
  
  return this.save();
};

// Method to get behavior summary for a period
disciplineSchema.statics.getBehaviorSummary = async function(studentId, startDate, endDate) {
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
        totalPositivePoints: { $sum: '$behaviorPoints.positive' },
        totalNegativePoints: { $sum: '$behaviorPoints.negative' },
        netPoints: { $sum: '$behaviorPoints.net' },
        averageSatisfaction: { $avg: '$teacherSatisfaction.score' },
        excellentDays: {
          $sum: {
            $cond: [{ $eq: ['$summary.overallBehavior', 'excellent'] }, 1, 0]
          }
        },
        goodDays: {
          $sum: {
            $cond: [{ $eq: ['$summary.overallBehavior', 'good'] }, 1, 0]
          }
        },
        averageDays: {
          $sum: {
            $cond: [{ $eq: ['$summary.overallBehavior', 'average'] }, 1, 0]
          }
        },
        poorDays: {
          $sum: {
            $cond: [{ $eq: ['$summary.overallBehavior', 'poor'] }, 1, 0]
          }
        },
        concerningDays: {
          $sum: {
            $cond: [{ $eq: ['$summary.overallBehavior', 'concerning'] }, 1, 0]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : null;
};

// Method to get students with concerning behavior
disciplineSchema.statics.getConcerningStudents = async function(classId, section, date) {
  return await this.find({
    class: classId,
    section: section,
    date: date,
    'summary.overallBehavior': { $in: ['poor', 'concerning'] }
  }).populate('student', 'user currentClass section').populate('student.user', 'firstName lastName phone');
};

module.exports = mongoose.model('Discipline', disciplineSchema);
