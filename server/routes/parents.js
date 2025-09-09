const express = require('express');
const { body, validationResult } = require('express-validator');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get parent profile
router.get('/profile', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id })
      .populate('children', 'studentId currentClass section user')
      .populate('children.currentClass', 'name level')
      .populate('children.user', 'firstName lastName')
      .populate('user', 'firstName lastName email phone');

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    res.json(parent);

  } catch (error) {
    console.error('Get parent profile error:', error);
    res.status(500).json({ message: 'Failed to fetch parent profile' });
  }
});

// Update parent profile
router.put('/profile', authenticateToken, authorizeRole('parent'), [
  body('occupation').optional().isString(),
  body('workplace').optional().isString(),
  body('monthlyIncome').optional().isNumeric(),
  body('education').optional().isObject(),
  body('communicationPreferences').optional().isObject(),
  body('notificationSettings').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const { 
      occupation, 
      workplace, 
      monthlyIncome, 
      education, 
      communicationPreferences, 
      notificationSettings,
      emergencyContact 
    } = req.body;

    // Update fields
    if (occupation !== undefined) parent.occupation = occupation;
    if (workplace !== undefined) parent.workplace = workplace;
    if (monthlyIncome !== undefined) parent.monthlyIncome = monthlyIncome;
    if (education) parent.education = { ...parent.education, ...education };
    if (communicationPreferences) parent.communicationPreferences = { ...parent.communicationPreferences, ...communicationPreferences };
    if (notificationSettings) parent.notificationSettings = { ...parent.notificationSettings, ...notificationSettings };
    if (emergencyContact) parent.emergencyContact = { ...parent.emergencyContact, ...emergencyContact };

    await parent.save();

    res.json({
      message: 'Parent profile updated successfully',
      parent: {
        id: parent._id,
        occupation: parent.occupation,
        workplace: parent.workplace,
        communicationPreferences: parent.communicationPreferences,
        notificationSettings: parent.notificationSettings
      }
    });

  } catch (error) {
    console.error('Update parent profile error:', error);
    res.status(500).json({ message: 'Failed to update parent profile' });
  }
});

// Get children's status
router.get('/children/status', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const childrenStatus = await parent.getChildrenStatus();

    res.json({
      children: childrenStatus,
      total: childrenStatus.length
    });

  } catch (error) {
    console.error('Get children status error:', error);
    res.status(500).json({ message: 'Failed to fetch children status' });
  }
});

// Get child's daily report
router.get('/children/:childId/daily-report/:date', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const { childId, date } = req.params;
    const parent = await Parent.findOne({ user: req.user._id });

    if (!parent || !parent.children.includes(childId)) {
      return res.status(403).json({ message: 'Access denied to child data' });
    }

    const reportDate = new Date(date);

    // Get student data
    const student = await Student.findById(childId)
      .populate('user', 'firstName lastName')
      .populate('currentClass', 'name level');

    if (!student) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Get attendance for the date
    const Attendance = require('../models/Attendance');
    const attendance = await Attendance.findOne({
      student: childId,
      date: reportDate
    }).populate('markedBy', 'firstName lastName');

    // Get Namaz for the date
    const Namaz = require('../models/Namaz');
    const namaz = await Namaz.findOne({
      student: childId,
      date: reportDate
    });

    // Get Islamic studies for the date
    const IslamicStudies = require('../models/IslamicStudies');
    const islamicStudies = await IslamicStudies.findOne({
      student: childId,
      date: reportDate
    }).populate('markedBy', 'firstName lastName');

    // Get discipline for the date
    const Discipline = require('../models/Discipline');
    const discipline = await Discipline.findOne({
      student: childId,
      date: reportDate
    }).populate('markedBy', 'firstName lastName');

    // Get fitness for the date
    const Fitness = require('../models/Fitness');
    const fitness = await Fitness.findOne({
      student: childId,
      date: reportDate
    }).populate('markedBy', 'firstName lastName');

    // Calculate overall performance
    const attendanceScore = attendance ? (attendance.status === 'present' || attendance.status === 'late' ? 100 : 0) : 0;
    const namazScore = namaz ? namaz.summary.percentage : 0;
    const islamicScore = islamicStudies ? islamicStudies.overallPerformance.score : 0;
    const disciplineScore = discipline ? (discipline.behaviorPoints.net >= 0 ? 80 : 60) : 80;
    const fitnessScore = fitness ? fitness.summary.fitnessScore : 80;

    const overallPerformance = Math.round(
      (attendanceScore * 0.2) + 
      (namazScore * 0.3) + 
      (islamicScore * 0.3) + 
      (disciplineScore * 0.1) + 
      (fitnessScore * 0.1)
    );

    res.json({
      child: {
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        studentId: student.studentId,
        class: student.currentClass.name,
        section: student.section
      },
      date: reportDate,
      attendance: attendance ? {
        status: attendance.status,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        markedBy: attendance.markedBy ? `${attendance.markedBy.firstName} ${attendance.markedBy.lastName}` : null,
        notes: attendance.notes
      } : null,
      namaz: namaz ? {
        summary: namaz.summary,
        prayers: namaz.prayers
      } : null,
      islamicStudies: islamicStudies ? {
        sabaq: islamicStudies.sabaq,
        sabqi: islamicStudies.sabqi,
        manzil: islamicStudies.manzil,
        tajweed: islamicStudies.tajweed,
        overallPerformance: islamicStudies.overallPerformance,
        markedBy: islamicStudies.markedBy ? `${islamicStudies.markedBy.firstName} ${islamicStudies.markedBy.lastName}` : null
      } : null,
      discipline: discipline ? {
        behaviorPoints: discipline.behaviorPoints,
        teacherSatisfaction: discipline.teacherSatisfaction,
        summary: discipline.summary,
        markedBy: discipline.markedBy ? `${discipline.markedBy.firstName} ${discipline.markedBy.lastName}` : null
      } : null,
      fitness: fitness ? {
        summary: fitness.summary,
        activities: fitness.activities,
        teacherAssessment: fitness.teacherAssessment,
        markedBy: fitness.markedBy ? `${fitness.markedBy.firstName} ${fitness.markedBy.lastName}` : null
      } : null,
      overallPerformance
    });

  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ message: 'Failed to fetch daily report' });
  }
});

// Get child's performance summary
router.get('/children/:childId/performance', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const { childId } = req.params;
    const { period = '30' } = req.query; // days

    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent || !parent.children.includes(childId)) {
      return res.status(403).json({ message: 'Access denied to child data' });
    }

    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Get student data
    const student = await Student.findById(childId)
      .populate('user', 'firstName lastName')
      .populate('currentClass', 'name level');

    if (!student) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Calculate attendance percentage
    const Attendance = require('../models/Attendance');
    const attendancePercentage = await Attendance.calculateAttendancePercentage(
      childId,
      startDate,
      endDate
    );

    // Calculate Namaz percentage
    const Namaz = require('../models/Namaz');
    const namazPercentage = await Namaz.calculateNamazPercentage(
      childId,
      startDate,
      endDate
    );

    // Get Islamic studies performance
    const IslamicStudies = require('../models/IslamicStudies');
    const islamicStudiesRecords = await IslamicStudies.find({
      student: childId,
      date: { $gte: startDate, $lte: endDate }
    });

    const islamicStudiesPercentage = islamicStudiesRecords.length > 0
      ? islamicStudiesRecords.reduce((sum, record) => sum + record.overallPerformance.score, 0) / islamicStudiesRecords.length
      : 0;

    // Get discipline performance
    const Discipline = require('../models/Discipline');
    const disciplineRecords = await Discipline.find({
      student: childId,
      date: { $gte: startDate, $lte: endDate }
    });

    const disciplinePercentage = disciplineRecords.length > 0
      ? disciplineRecords.reduce((sum, record) => sum + record.teacherSatisfaction.score, 0) / disciplineRecords.length * 20
      : 80;

    // Calculate overall performance
    const overallPerformance = Math.round(
      (attendancePercentage * 0.2) + 
      (namazPercentage * 0.3) + 
      (islamicStudiesPercentage * 0.3) + 
      (disciplinePercentage * 0.2)
    );

    res.json({
      child: {
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        studentId: student.studentId,
        class: student.currentClass.name,
        section: student.section
      },
      period: { startDate, endDate, days: parseInt(period) },
      performance: {
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        namazPercentage: Math.round(namazPercentage * 100) / 100,
        islamicStudiesPercentage: Math.round(islamicStudiesPercentage * 100) / 100,
        disciplinePercentage: Math.round(disciplinePercentage * 100) / 100,
        overallPerformance
      },
      recordsCount: {
        islamicStudies: islamicStudiesRecords.length,
        discipline: disciplineRecords.length
      }
    });

  } catch (error) {
    console.error('Get child performance error:', error);
    res.status(500).json({ message: 'Failed to fetch child performance' });
  }
});

// Get notifications
router.get('/notifications', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const notifications = await parent.getRecentNotifications();

    res.json({
      notifications,
      total: notifications.length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Update notification settings
router.put('/notification-settings', authenticateToken, authorizeRole('parent'), [
  body('attendanceAlerts').optional().isBoolean(),
  body('namazAlerts').optional().isBoolean(),
  body('disciplineAlerts').optional().isBoolean(),
  body('performanceAlerts').optional().isBoolean(),
  body('generalUpdates').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const { 
      attendanceAlerts, 
      namazAlerts, 
      disciplineAlerts, 
      performanceAlerts, 
      generalUpdates 
    } = req.body;

    // Update notification settings
    if (attendanceAlerts !== undefined) parent.notificationSettings.attendanceAlerts = attendanceAlerts;
    if (namazAlerts !== undefined) parent.notificationSettings.namazAlerts = namazAlerts;
    if (disciplineAlerts !== undefined) parent.notificationSettings.disciplineAlerts = disciplineAlerts;
    if (performanceAlerts !== undefined) parent.notificationSettings.performanceAlerts = performanceAlerts;
    if (generalUpdates !== undefined) parent.notificationSettings.generalUpdates = generalUpdates;

    await parent.save();

    res.json({
      message: 'Notification settings updated successfully',
      settings: parent.notificationSettings
    });

  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ message: 'Failed to update notification settings' });
  }
});

// Get parent engagement score
router.get('/engagement', authenticateToken, authorizeRole('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const engagementScore = parent.calculateEngagementScore();

    res.json({
      engagement: {
        score: engagementScore,
        level: engagementScore >= 80 ? 'high' : engagementScore >= 60 ? 'medium' : 'low',
        totalLogins: parent.engagement.totalLogins,
        reportsViewed: parent.engagement.reportsViewed,
        messagesSent: parent.engagement.messagesSent,
        feedbackProvided: parent.engagement.feedbackProvided,
        lastLogin: parent.engagement.lastLogin
      }
    });

  } catch (error) {
    console.error('Get engagement score error:', error);
    res.status(500).json({ message: 'Failed to fetch engagement score' });
  }
});

module.exports = router;
