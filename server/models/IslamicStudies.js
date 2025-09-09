const mongoose = require('mongoose');

const islamicStudiesSchema = new mongoose.Schema({
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
  
  // Sabaq (New Lesson)
  sabaq: {
    surah: {
      name: String,
      number: Number
    },
    fromAyah: Number,
    toAyah: Number,
    description: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    },
    notes: String
  },
  
  // Sabqi (Revision of Yesterday's Lesson)
  sabqi: {
    surah: {
      name: String,
      number: Number
    },
    fromAyah: Number,
    toAyah: Number,
    performance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    },
    mistakes: [{
      type: String,
      description: String
    }],
    notes: String
  },
  
  // Manzil (Long-term Revision)
  manzil: {
    surah: {
      name: String,
      number: Number
    },
    fromAyah: Number,
    toAyah: Number,
    performance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    },
    notes: String
  },
  
  // Word of the Day
  wordOfTheDay: {
    arabic: String,
    english: String,
    urdu: String,
    meaning: String,
    context: String,
    learned: {
      type: Boolean,
      default: false
    }
  },
  
  // Daily Islamic Knowledge
  dailyKnowledge: {
    hadith: {
      text: String,
      reference: String,
      explanation: String,
      learned: {
        type: Boolean,
        default: false
      }
    },
    dua: {
      arabic: String,
      english: String,
      urdu: String,
      context: String,
      learned: {
        type: Boolean,
        default: false
      }
    },
    islamicFacts: [{
      fact: String,
      category: String,
      learned: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Tajweed Practice
  tajweed: {
    practiced: {
      type: Boolean,
      default: false
    },
    focus: [{
      type: String,
      enum: ['makharij', 'sifat', 'rules', 'melody', 'other']
    }],
    performance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    },
    notes: String
  },
  
  // Memorization Progress
  memorization: {
    newVerses: {
      type: Number,
      default: 0
    },
    revisedVerses: {
      type: Number,
      default: 0
    },
    totalMemorized: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      default: 0
    }
  },
  
  // Overall Performance
  overallPerformance: {
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
      default: 'B'
    },
    teacherRemarks: String
  },
  
  // Marked By
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
islamicStudiesSchema.index({ student: 1, date: 1 });
islamicStudiesSchema.index({ class: 1, section: 1, date: 1 });
islamicStudiesSchema.index({ date: 1 });
islamicStudiesSchema.index({ 'overallPerformance.score': 1 });

// Compound index for unique record per student per day
islamicStudiesSchema.index({ student: 1, date: 1 }, { unique: true });

// Pre-save middleware to calculate overall performance
islamicStudiesSchema.pre('save', function(next) {
  let score = 0;
  let count = 0;
  
  // Sabaq performance (30% weight)
  const sabaqScore = this.getPerformanceScore(this.sabaq.performance);
  score += sabaqScore * 0.3;
  count += 0.3;
  
  // Sabqi performance (25% weight)
  const sabqiScore = this.getPerformanceScore(this.sabqi.performance);
  score += sabqiScore * 0.25;
  count += 0.25;
  
  // Manzil performance (20% weight)
  const manzilScore = this.getPerformanceScore(this.manzil.performance);
  score += manzilScore * 0.2;
  count += 0.2;
  
  // Tajweed performance (15% weight)
  const tajweedScore = this.getPerformanceScore(this.tajweed.performance);
  score += tajweedScore * 0.15;
  count += 0.15;
  
  // Daily knowledge (10% weight)
  const knowledgeScore = this.calculateKnowledgeScore();
  score += knowledgeScore * 0.1;
  count += 0.1;
  
  this.overallPerformance.score = count > 0 ? Math.round(score / count) : 0;
  this.overallPerformance.grade = this.getGradeFromScore(this.overallPerformance.score);
  
  next();
});

// Helper method to convert performance to score
islamicStudiesSchema.methods.getPerformanceScore = function(performance) {
  const scores = {
    'excellent': 100,
    'good': 80,
    'average': 60,
    'needs_improvement': 40
  };
  return scores[performance] || 0;
};

// Helper method to calculate knowledge score
islamicStudiesSchema.methods.calculateKnowledgeScore = function() {
  let score = 0;
  let count = 0;
  
  if (this.dailyKnowledge.hadith.learned) {
    score += 100;
    count++;
  }
  
  if (this.dailyKnowledge.dua.learned) {
    score += 100;
    count++;
  }
  
  const learnedFacts = this.dailyKnowledge.islamicFacts.filter(fact => fact.learned).length;
  if (this.dailyKnowledge.islamicFacts.length > 0) {
    score += (learnedFacts / this.dailyKnowledge.islamicFacts.length) * 100;
    count++;
  }
  
  if (this.wordOfTheDay.learned) {
    score += 100;
    count++;
  }
  
  return count > 0 ? score / count : 0;
};

// Helper method to get grade from score
islamicStudiesSchema.methods.getGradeFromScore = function(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

// Static method to get student's progress over time
islamicStudiesSchema.statics.getStudentProgress = async function(studentId, startDate, endDate) {
  return await this.find({
    student: studentId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 }).select('date overallPerformance sabaq sabqi manzil tajweed');
};

// Static method to get class performance summary
islamicStudiesSchema.statics.getClassPerformanceSummary = async function(classId, section, date) {
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
        _id: null,
        totalStudents: { $sum: 1 },
        averageScore: { $avg: '$overallPerformance.score' },
        excellentCount: {
          $sum: {
            $cond: [{ $eq: ['$overallPerformance.grade', 'A+'] }, 1, 0]
          }
        },
        goodCount: {
          $sum: {
            $cond: [{ $in: ['$overallPerformance.grade', ['A', 'B+']] }, 1, 0]
          }
        },
        needsImprovementCount: {
          $sum: {
            $cond: [{ $in: ['$overallPerformance.grade', ['C', 'D', 'F']] }, 1, 0]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : null;
};

module.exports = mongoose.model('IslamicStudies', islamicStudiesSchema);
