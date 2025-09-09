const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
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
  
  // Physical Measurements
  measurements: {
    height: {
      value: Number, // in cm
      unit: {
        type: String,
        enum: ['cm', 'ft'],
        default: 'cm'
      }
    },
    weight: {
      value: Number, // in kg
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      }
    },
    bmi: {
      type: Number,
      min: 0,
      max: 100
    },
    bmiCategory: {
      type: String,
      enum: ['underweight', 'normal', 'overweight', 'obese'],
      default: 'normal'
    }
  },
  
  // Physical Activities
  activities: [{
    type: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'swimming', 'sports', 'exercise', 'other'],
      required: true
    },
    name: String,
    duration: {
      type: Number, // in minutes
      required: true
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate'
    },
    calories: Number,
    notes: String
  }],
  
  // Sports Participation
  sports: [{
    sport: {
      type: String,
      required: true
    },
    duration: Number, // in minutes
    performance: {
      type: String,
      enum: ['excellent', 'good', 'average', 'needs_improvement'],
      default: 'good'
    },
    team: String,
    position: String,
    achievements: [String],
    notes: String
  }],
  
  // Health Status
  health: {
    generalHealth: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    energyLevel: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    sleepQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24
    },
    anyInjuries: {
      type: Boolean,
      default: false
    },
    injuryDetails: String,
    medications: [String],
    allergies: [String]
  },
  
  // Fitness Goals
  goals: {
    current: [{
      type: String,
      enum: ['weight_loss', 'weight_gain', 'muscle_building', 'endurance', 'flexibility', 'general_fitness'],
      description: String,
      target: String,
      deadline: Date,
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    }],
    achievements: [{
      goal: String,
      achievedAt: Date,
      description: String
    }]
  },
  
  // Daily Summary
  summary: {
    totalActivityMinutes: {
      type: Number,
      default: 0
    },
    totalCalories: {
      type: Number,
      default: 0
    },
    fitnessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    recommendations: [String]
  },
  
  // Teacher Assessment
  teacherAssessment: {
    participation: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'good'
    },
    effort: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor'],
      default: 'good'
    },
    improvement: {
      type: String,
      enum: ['significant', 'moderate', 'minimal', 'none'],
      default: 'moderate'
    },
    remarks: String,
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
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
fitnessSchema.index({ student: 1, date: 1 });
fitnessSchema.index({ class: 1, section: 1, date: 1 });
fitnessSchema.index({ date: 1 });
fitnessSchema.index({ 'summary.fitnessScore': 1 });
fitnessSchema.index({ 'measurements.bmi': 1 });

// Compound index for unique record per student per day
fitnessSchema.index({ student: 1, date: 1 }, { unique: true });

// Pre-save middleware to calculate BMI and fitness score
fitnessSchema.pre('save', function(next) {
  // Calculate BMI
  if (this.measurements.height && this.measurements.weight) {
    const heightInMeters = this.measurements.height.unit === 'cm' 
      ? this.measurements.height.value / 100 
      : this.measurements.height.value * 0.3048;
    
    const weightInKg = this.measurements.weight.unit === 'kg'
      ? this.measurements.weight.value
      : this.measurements.weight.value * 0.453592;
    
    this.measurements.bmi = weightInKg / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    if (this.measurements.bmi < 18.5) {
      this.measurements.bmiCategory = 'underweight';
    } else if (this.measurements.bmi < 25) {
      this.measurements.bmiCategory = 'normal';
    } else if (this.measurements.bmi < 30) {
      this.measurements.bmiCategory = 'overweight';
    } else {
      this.measurements.bmiCategory = 'obese';
    }
  }
  
  // Calculate total activity minutes and calories
  this.summary.totalActivityMinutes = this.activities.reduce((total, activity) => 
    total + activity.duration, 0);
  this.summary.totalCalories = this.activities.reduce((total, activity) => 
    total + (activity.calories || 0), 0);
  
  // Calculate fitness score
  this.summary.fitnessScore = this.calculateFitnessScore();
  
  next();
});

// Method to calculate fitness score
fitnessSchema.methods.calculateFitnessScore = function() {
  let score = 0;
  let factors = 0;
  
  // BMI factor (30% weight)
  if (this.measurements.bmi) {
    if (this.measurements.bmiCategory === 'normal') {
      score += 30;
    } else if (this.measurements.bmiCategory === 'underweight' || this.measurements.bmiCategory === 'overweight') {
      score += 20;
    } else {
      score += 10;
    }
    factors += 30;
  }
  
  // Activity factor (40% weight)
  const activityScore = Math.min(40, (this.summary.totalActivityMinutes / 60) * 10);
  score += activityScore;
  factors += 40;
  
  // Health factor (20% weight)
  const healthScores = {
    'excellent': 20,
    'good': 15,
    'fair': 10,
    'poor': 5
  };
  score += healthScores[this.health.generalHealth] || 0;
  factors += 20;
  
  // Teacher assessment factor (10% weight)
  const participationScores = {
    'excellent': 10,
    'good': 8,
    'average': 6,
    'poor': 4
  };
  score += participationScores[this.teacherAssessment.participation] || 0;
  factors += 10;
  
  return factors > 0 ? Math.round(score) : 0;
};

// Method to add activity
fitnessSchema.methods.addActivity = function(type, name, duration, intensity, calories, notes) {
  this.activities.push({
    type,
    name,
    duration,
    intensity,
    calories,
    notes
  });
  return this.save();
};

// Method to add sport participation
fitnessSchema.methods.addSport = function(sport, duration, performance, team, position, achievements, notes) {
  this.sports.push({
    sport,
    duration,
    performance,
    team,
    position,
    achievements,
    notes
  });
  return this.save();
};

// Static method to get fitness trends
fitnessSchema.statics.getFitnessTrends = async function(studentId, startDate, endDate) {
  return await this.find({
    student: studentId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 }).select('date measurements summary health teacherAssessment');
};

// Static method to get class fitness summary
fitnessSchema.statics.getClassFitnessSummary = async function(classId, section, date) {
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
        averageFitnessScore: { $avg: '$summary.fitnessScore' },
        averageActivityMinutes: { $avg: '$summary.totalActivityMinutes' },
        averageBMI: { $avg: '$measurements.bmi' },
        excellentFitness: {
          $sum: {
            $cond: [{ $gte: ['$summary.fitnessScore', 80] }, 1, 0]
          }
        },
        goodFitness: {
          $sum: {
            $cond: [
              { $and: [
                { $gte: ['$summary.fitnessScore', 60] },
                { $lt: ['$summary.fitnessScore', 80] }
              ]},
              1, 0
            ]
          }
        },
        needsImprovement: {
          $sum: {
            $cond: [{ $lt: ['$summary.fitnessScore', 60] }, 1, 0]
          }
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result.length > 0 ? result[0] : null;
};

module.exports = mongoose.model('Fitness', fitnessSchema);
