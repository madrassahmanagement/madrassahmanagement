const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  // Class Information
  name: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: String,
    required: true,
    enum: ['nursery', 'kg1', 'kg2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'hifz', 'tajweed', 'arabic', 'other']
  },
  description: String,
  
  // Academic Information
  academicYear: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    default: 30
  },
  currentStudents: {
    type: Number,
    default: 0
  },
  
  // Sections
  sections: [{
    name: {
      type: String,
      required: true
    },
    maxStudents: {
      type: Number,
      default: 30
    },
    currentStudents: {
      type: Number,
      default: 0
    },
    homeroomTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  }],
  
  // Subjects
  subjects: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    weeklyHours: {
      type: Number,
      default: 1
    }
  }],
  
  // Schedule
  schedule: {
    startTime: String,
    endTime: String,
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  
  // Islamic Studies Focus
  islamicStudies: {
    quranRecitation: {
      enabled: Boolean,
      weeklyHours: Number
    },
    quranMemorization: {
      enabled: Boolean,
      weeklyHours: Number
    },
    tajweed: {
      enabled: Boolean,
      weeklyHours: Number
    },
    hadith: {
      enabled: Boolean,
      weeklyHours: Number
    },
    seerah: {
      enabled: Boolean,
      weeklyHours: Number
    },
    arabic: {
      enabled: Boolean,
      weeklyHours: Number
    }
  },
  
  // Performance Tracking
  performanceMetrics: {
    averageAttendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageNamaz: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    averageAcademic: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: Date
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
classSchema.index({ name: 1 });
classSchema.index({ level: 1 });
classSchema.index({ academicYear: 1 });
classSchema.index({ status: 1 });

// Method to add student to class
classSchema.methods.addStudent = function(sectionName) {
  const section = this.sections.find(s => s.name === sectionName);
  if (section && section.currentStudents < section.maxStudents) {
    section.currentStudents += 1;
    this.currentStudents += 1;
    return true;
  }
  return false;
};

// Method to remove student from class
classSchema.methods.removeStudent = function(sectionName) {
  const section = this.sections.find(s => s.name === sectionName);
  if (section && section.currentStudents > 0) {
    section.currentStudents -= 1;
    this.currentStudents -= 1;
    return true;
  }
  return false;
};

// Method to get available sections
classSchema.methods.getAvailableSections = function() {
  return this.sections.filter(section => 
    section.currentStudents < section.maxStudents
  );
};

// Method to calculate class performance
classSchema.methods.calculatePerformance = async function() {
  const Student = mongoose.model('Student');
  const students = await Student.find({
    currentClass: this._id,
    status: 'active'
  });
  
  if (students.length === 0) {
    this.performanceMetrics = {
      averageAttendance: 0,
      averageNamaz: 0,
      averageAcademic: 0,
      lastUpdated: new Date()
    };
    return;
  }
  
  const totalAttendance = students.reduce((sum, student) => sum + student.attendancePercentage, 0);
  const totalNamaz = students.reduce((sum, student) => sum + student.namazPercentage, 0);
  const totalAcademic = students.reduce((sum, student) => sum + student.overallPerformance, 0);
  
  this.performanceMetrics = {
    averageAttendance: totalAttendance / students.length,
    averageNamaz: totalNamaz / students.length,
    averageAcademic: totalAcademic / students.length,
    lastUpdated: new Date()
  };
};

module.exports = mongoose.model('Class', classSchema);
