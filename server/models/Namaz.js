const mongoose = require('mongoose');

const namazSchema = new mongoose.Schema({
  // Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Date
  date: {
    type: Date,
    required: true
  },
  
  // Prayer Times
  prayers: {
    fajr: {
      performed: {
        type: Boolean,
        default: false
      },
      location: {
        type: String,
        enum: ['madrassah', 'home', 'other'],
        default: 'madrassah'
      },
      time: Date,
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    },
    dhuhr: {
      performed: {
        type: Boolean,
        default: false
      },
      location: {
        type: String,
        enum: ['madrassah', 'home', 'other'],
        default: 'madrassah'
      },
      time: Date,
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    },
    asr: {
      performed: {
        type: Boolean,
        default: false
      },
      location: {
        type: String,
        enum: ['madrassah', 'home', 'other'],
        default: 'madrassah'
      },
      time: Date,
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    },
    maghrib: {
      performed: {
        type: Boolean,
        default: false
      },
      location: {
        type: String,
        enum: ['madrassah', 'home', 'other'],
        default: 'madrassah'
      },
      time: Date,
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    },
    isha: {
      performed: {
        type: Boolean,
        default: false
      },
      location: {
        type: String,
        enum: ['madrassah', 'home', 'other'],
        default: 'madrassah'
      },
      time: Date,
      markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    }
  },
  
  // Daily Summary
  summary: {
    totalPerformed: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    madrassahCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    homeCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    missedCount: {
      type: Number,
      default: 5,
      min: 0,
      max: 5
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Notifications
  notifications: {
    parentNotified: {
      type: Boolean,
      default: false
    },
    teacherNotified: {
      type: Boolean,
      default: false
    },
    notificationSentAt: Date
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
namazSchema.index({ student: 1, date: 1 });
namazSchema.index({ date: 1 });
namazSchema.index({ 'summary.percentage': 1 });

// Compound index for unique namaz record per student per day
namazSchema.index({ student: 1, date: 1 }, { unique: true });

// Pre-save middleware to calculate summary
namazSchema.pre('save', function(next) {
  const prayers = this.prayers;
  const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  
  let totalPerformed = 0;
  let madrassahCount = 0;
  let homeCount = 0;
  
  prayerNames.forEach(prayer => {
    if (prayers[prayer].performed) {
      totalPerformed++;
      if (prayers[prayer].location === 'madrassah') {
        madrassahCount++;
      } else if (prayers[prayer].location === 'home') {
        homeCount++;
      }
    }
  });
  
  this.summary = {
    totalPerformed,
    madrassahCount,
    homeCount,
    missedCount: 5 - totalPerformed,
    percentage: (totalPerformed / 5) * 100
  };
  
  next();
});

// Method to mark prayer as performed
namazSchema.methods.markPrayer = function(prayerName, location, markedBy, notes = '') {
  if (!this.prayers[prayerName]) {
    throw new Error(`Invalid prayer name: ${prayerName}`);
  }
  
  this.prayers[prayerName] = {
    performed: true,
    location: location,
    time: new Date(),
    markedBy: markedBy,
    notes: notes
  };
  
  return this.save();
};

// Method to get missed prayers
namazSchema.methods.getMissedPrayers = function() {
  const missed = [];
  const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  
  prayerNames.forEach(prayer => {
    if (!this.prayers[prayer].performed) {
      missed.push(prayer);
    }
  });
  
  return missed;
};

// Static method to calculate namaz percentage for a student
namazSchema.statics.calculateNamazPercentage = async function(studentId, startDate, endDate) {
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
        totalPrayers: { $sum: { $multiply: ['$totalDays', 5] } },
        performedPrayers: { $sum: '$summary.totalPerformed' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  if (result.length === 0) return 0;
  
  const { totalPrayers, performedPrayers } = result[0];
  return totalPrayers > 0 ? (performedPrayers / totalPrayers) * 100 : 0;
};

// Static method to get students with missed prayers
namazSchema.statics.getStudentsWithMissedPrayers = async function(date) {
  return await this.find({
    date: date,
    'summary.missedCount': { $gt: 0 }
  }).populate('student', 'user currentClass section').populate('student.user', 'firstName lastName phone');
};

module.exports = mongoose.model('Namaz', namazSchema);
