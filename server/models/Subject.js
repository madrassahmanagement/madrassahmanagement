const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  // Subject Information
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  
  // Subject Type
  type: {
    type: String,
    enum: ['academic', 'islamic', 'language', 'physical', 'art', 'other'],
    required: true
  },
  
  // Islamic Studies Specific
  islamicCategory: {
    type: String,
    enum: ['quran_recitation', 'quran_memorization', 'tajweed', 'hadith', 'seerah', 'arabic', 'fiqh', 'aqeedah', 'other']
  },
  
  // Academic Information
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  },
  credits: {
    type: Number,
    default: 1
  },
  
  // Curriculum
  curriculum: {
    objectives: [String],
    learningOutcomes: [String],
    topics: [{
      name: String,
      description: String,
      duration: Number, // in weeks
      order: Number
    }],
    assessmentMethods: [String]
  },
  
  // Resources
  resources: {
    textbooks: [{
      title: String,
      author: String,
      publisher: String,
      edition: String,
      isbn: String
    }],
    digitalResources: [{
      title: String,
      type: {
        type: String,
        enum: ['video', 'audio', 'document', 'interactive', 'other']
      },
      url: String,
      description: String
    }],
    supplementaryMaterials: [String]
  },
  
  // Assessment
  assessment: {
    totalMarks: {
      type: Number,
      default: 100
    },
    passingMarks: {
      type: Number,
      default: 50
    },
    components: [{
      name: String,
      weight: Number, // percentage
      type: {
        type: String,
        enum: ['exam', 'assignment', 'project', 'presentation', 'participation', 'attendance', 'other']
      },
      description: String
    }]
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
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
subjectSchema.index({ name: 1 });
subjectSchema.index({ code: 1 });
subjectSchema.index({ type: 1 });
subjectSchema.index({ islamicCategory: 1 });
subjectSchema.index({ status: 1 });

// Method to get total weight of assessment components
subjectSchema.methods.getTotalWeight = function() {
  return this.assessment.components.reduce((total, component) => total + component.weight, 0);
};

// Method to validate assessment weights
subjectSchema.methods.validateAssessmentWeights = function() {
  const totalWeight = this.getTotalWeight();
  return Math.abs(totalWeight - 100) < 0.01; // Allow for small floating point errors
};

// Method to get subject summary
subjectSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    code: this.code,
    type: this.type,
    islamicCategory: this.islamicCategory,
    level: this.level,
    credits: this.credits,
    totalMarks: this.assessment.totalMarks,
    passingMarks: this.assessment.passingMarks,
    status: this.status
  };
};

module.exports = mongoose.model('Subject', subjectSchema);
