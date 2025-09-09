const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Parent Information
  parentId: {
    type: String,
    required: true,
    unique: true
  },
  relationship: {
    type: String,
    enum: ['father', 'mother', 'guardian', 'grandfather', 'grandmother', 'uncle', 'aunt'],
    required: true
  },
  
  // Children Information
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Personal Information
  occupation: String,
  workplace: String,
  monthlyIncome: {
    type: Number,
    min: 0
  },
  education: {
    level: {
      type: String,
      enum: ['primary', 'secondary', 'higher_secondary', 'bachelor', 'master', 'phd', 'other']
    },
    institution: String,
    year: Number
  },
  
  // Contact Information
  primaryPhone: {
    type: String,
    required: true
  },
  secondaryPhone: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  
  // Communication Preferences
  communicationPreferences: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
      }
    },
    sms: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
      }
    },
    pushNotifications: {
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Notification Settings
  notificationSettings: {
    attendanceAlerts: {
      type: Boolean,
      default: true
    },
    namazAlerts: {
      type: Boolean,
      default: true
    },
    disciplineAlerts: {
      type: Boolean,
      default: true
    },
    performanceAlerts: {
      type: Boolean,
      default: true
    },
    generalUpdates: {
      type: Boolean,
      default: true
    }
  },
  
  // Parent Engagement
  engagement: {
    lastLogin: Date,
    totalLogins: {
      type: Number,
      default: 0
    },
    reportsViewed: {
      type: Number,
      default: 0
    },
    messagesSent: {
      type: Number,
      default: 0
    },
    feedbackProvided: {
      type: Number,
      default: 0
    }
  },
  
  // Fee Management
  feeManagement: {
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank_transfer', 'mobile_banking', 'other'],
      default: 'cash'
    },
    paymentHistory: [{
      date: Date,
      amount: Number,
      method: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
      },
      transactionId: String
    }],
    outstandingAmount: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
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
parentSchema.index({ parentId: 1 });
parentSchema.index({ children: 1 });
parentSchema.index({ status: 1 });
parentSchema.index({ 'engagement.lastLogin': -1 });

// Virtual for full name
parentSchema.virtual('fullName').get(function() {
  return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
});

// Method to get children's current status
parentSchema.methods.getChildrenStatus = async function() {
  const Student = mongoose.model('Student');
  const children = await Student.find({
    _id: { $in: this.children }
  }).populate('user', 'firstName lastName').populate('currentClass', 'name');
  
  return children.map(child => ({
    id: child._id,
    name: child.user ? `${child.user.firstName} ${child.user.lastName}` : '',
    class: child.currentClass ? child.currentClass.name : '',
    section: child.section,
    status: child.status,
    performance: child.overallPerformance
  }));
};

// Method to get recent notifications
parentSchema.methods.getRecentNotifications = async function() {
  const Notification = mongoose.model('Notification');
  return await Notification.find({
    recipient: this._id,
    type: 'parent'
  }).sort({ createdAt: -1 }).limit(10);
};

// Method to calculate engagement score
parentSchema.methods.calculateEngagementScore = function() {
  const { totalLogins, reportsViewed, messagesSent, feedbackProvided } = this.engagement;
  const score = (totalLogins * 0.3) + (reportsViewed * 0.4) + (messagesSent * 0.2) + (feedbackProvided * 0.1);
  return Math.min(100, Math.max(0, score));
};

module.exports = mongoose.model('Parent', parentSchema);
