const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Student Information
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  admissionDate: {
    type: Date,
    required: true
  },
  admissionNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Academic Information
  currentClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  section: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  
  // Guardian Information
  guardian: {
    father: {
      name: String,
      phone: String,
      occupation: String,
      cnic: String
    },
    mother: {
      name: String,
      phone: String,
      occupation: String,
      cnic: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    }
  },
  
  // Academic Progress
  academicYear: {
    type: String,
    required: true
  },
  previousClass: String,
  promotionDate: Date,
  
  // Islamic Studies Progress
  quranLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'hafiz'],
    default: 'beginner'
  },
  currentSurah: String,
  currentAyah: Number,
  memorizationProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Health Information
  health: {
    bloodGroup: String,
    allergies: [String],
    medicalConditions: [String],
    emergencyMedication: String,
    doctorName: String,
    doctorPhone: String
  },
  
  // Performance Tracking
  overallPerformance: {
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
  namazPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated', 'transferred'],
    default: 'active'
  },
  
  // Fees (if applicable)
  feeStatus: {
    type: String,
    enum: ['paid', 'pending', 'exempt'],
    default: 'pending'
  },
  monthlyFee: {
    type: Number,
    default: 0
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
studentSchema.index({ studentId: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ currentClass: 1, section: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ academicYear: 1 });

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Method to calculate overall performance
studentSchema.methods.calculateOverallPerformance = function() {
  // This will be calculated based on attendance, namaz, academic performance, etc.
  // Implementation will be added in the service layer
  return this.overallPerformance;
};

// Method to get current academic progress
studentSchema.methods.getAcademicProgress = function() {
  return {
    quranLevel: this.quranLevel,
    currentSurah: this.currentSurah,
    currentAyah: this.currentAyah,
    memorizationProgress: this.memorizationProgress,
    overallPerformance: this.overallPerformance
  };
};

module.exports = mongoose.model('Student', studentSchema);
