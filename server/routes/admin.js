const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Namaz = require('../models/Namaz');
const IslamicStudies = require('../models/IslamicStudies');
const Discipline = require('../models/Discipline');
const Fitness = require('../models/Fitness');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get system statistics
router.get('/stats', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Basic counts
    const totalStudents = await Student.countDocuments({ status: 'active' });
    const totalTeachers = await Teacher.countDocuments({ status: 'active' });
    const totalClasses = await Class.countDocuments({ status: 'active' });
    const totalParents = await User.countDocuments({ role: 'parent', isActive: true });
    const totalStaff = await User.countDocuments({ role: 'staff', isActive: true });

    // Recent admissions
    const recentAdmissions = await Student.countDocuments({
      admissionDate: { $gte: startDate, $lte: endDate }
    });

    // Attendance statistics
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const totalAttendanceRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    const attendancePercentage = totalAttendanceRecords > 0 ? (presentCount / totalAttendanceRecords) * 100 : 0;

    // Namaz statistics
    const namazRecords = await Namaz.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const totalPrayers = namazRecords.length * 5;
    const performedPrayers = namazRecords.reduce((sum, record) => sum + record.summary.totalPerformed, 0);
    const namazPercentage = totalPrayers > 0 ? (performedPrayers / totalPrayers) * 100 : 0;

    // Islamic studies statistics
    const islamicStudiesRecords = await IslamicStudies.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const averageIslamicScore = islamicStudiesRecords.length > 0
      ? islamicStudiesRecords.reduce((sum, record) => sum + record.overallPerformance.score, 0) / islamicStudiesRecords.length
      : 0;

    // Discipline statistics
    const disciplineRecords = await Discipline.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const concerningStudents = disciplineRecords.filter(r => 
      r.summary.overallBehavior === 'poor' || r.summary.overallBehavior === 'concerning'
    ).length;

    // Class-wise statistics
    const classes = await Class.find({ status: 'active' }).populate('subjects.subject', 'name');
    const classStats = classes.map(cls => ({
      id: cls._id,
      name: cls.name,
      level: cls.level,
      totalStudents: cls.currentStudents,
      maxStudents: cls.maxStudents,
      subjectsCount: cls.subjects.length,
      sections: cls.sections.length
    }));

    res.json({
      period: { startDate, endDate, days: parseInt(period) },
      overview: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalParents,
        totalStaff,
        recentAdmissions
      },
      performance: {
        attendance: {
          percentage: Math.round(attendancePercentage * 100) / 100,
          totalRecords: totalAttendanceRecords,
          present: presentCount,
          absent: totalAttendanceRecords - presentCount
        },
        namaz: {
          percentage: Math.round(namazPercentage * 100) / 100,
          totalPrayers,
          performedPrayers,
          missedPrayers: totalPrayers - performedPrayers
        },
        islamicStudies: {
          averageScore: Math.round(averageIslamicScore * 100) / 100,
          totalRecords: islamicStudiesRecords.length
        },
        discipline: {
          concerningStudents,
          totalRecords: disciplineRecords.length
        }
      },
      classes: classStats
    });

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ message: 'Failed to fetch system statistics' });
  }
});

// Get user management data
router.get('/users', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.isActive = status === 'active';
    }

    let users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Search by name or email
    if (search) {
      users = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      });
    }

    const total = users.length;
    const paginatedUsers = users.slice((page - 1) * limit, page * limit);

    // Get role-specific counts
    const roleCounts = {
      admin: await User.countDocuments({ role: 'admin', isActive: true }),
      teacher: await User.countDocuments({ role: 'teacher', isActive: true }),
      student: await User.countDocuments({ role: 'student', isActive: true }),
      parent: await User.countDocuments({ role: 'parent', isActive: true }),
      staff: await User.countDocuments({ role: 'staff', isActive: true })
    };

    res.json({
      users: paginatedUsers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      roleCounts
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Create subject
router.post('/subjects', authenticateToken, authorizeRole('admin'), [
  body('name').notEmpty().withMessage('Subject name is required'),
  body('code').notEmpty().withMessage('Subject code is required'),
  body('type').isIn(['academic', 'islamic', 'language', 'physical', 'art', 'other']).withMessage('Valid subject type is required'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all']),
  body('credits').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, code, type, islamicCategory, level, credits, description, curriculum, assessment } = req.body;

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ 
      $or: [{ name }, { code }] 
    });

    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this name or code already exists' });
    }

    // Create new subject
    const subject = new Subject({
      name,
      code,
      type,
      islamicCategory,
      level: level || 'all',
      credits: credits || 1,
      description,
      curriculum,
      assessment
    });

    await subject.save();

    res.status(201).json({
      message: 'Subject created successfully',
      subject: {
        id: subject._id,
        name: subject.name,
        code: subject.code,
        type: subject.type,
        level: subject.level
      }
    });

  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Failed to create subject' });
  }
});

// Get all subjects
router.get('/subjects', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const subjects = await Subject.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subject.countDocuments(query);

    res.json({
      subjects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

// Update subject
router.put('/subjects/:subjectId', authenticateToken, authorizeRole('admin'), [
  body('name').optional().notEmpty(),
  body('code').optional().notEmpty(),
  body('type').optional().isIn(['academic', 'islamic', 'language', 'physical', 'art', 'other']),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'all']),
  body('credits').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const { name, code, type, islamicCategory, level, credits, description, curriculum, assessment } = req.body;

    // Update fields
    if (name) subject.name = name;
    if (code) subject.code = code;
    if (type) subject.type = type;
    if (islamicCategory) subject.islamicCategory = islamicCategory;
    if (level) subject.level = level;
    if (credits) subject.credits = credits;
    if (description !== undefined) subject.description = description;
    if (curriculum) subject.curriculum = { ...subject.curriculum, ...curriculum };
    if (assessment) subject.assessment = { ...subject.assessment, ...assessment };

    await subject.save();

    res.json({
      message: 'Subject updated successfully',
      subject: {
        id: subject._id,
        name: subject.name,
        code: subject.code,
        type: subject.type,
        level: subject.level
      }
    });

  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Failed to update subject' });
  }
});

// Delete subject
router.delete('/subjects/:subjectId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if subject is assigned to any classes
    const classesWithSubject = await Class.find({
      'subjects.subject': req.params.subjectId
    });

    if (classesWithSubject.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subject. It is assigned to one or more classes.',
        assignedClasses: classesWithSubject.length
      });
    }

    // Soft delete - change status to inactive
    subject.status = 'inactive';
    await subject.save();

    res.json({ message: 'Subject deactivated successfully' });

  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Failed to delete subject' });
  }
});

// Get system health
router.get('/health', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const health = {
      database: 'connected',
      server: 'running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };

    // Check database connection
    try {
      await User.findOne().limit(1);
      health.database = 'connected';
    } catch (error) {
      health.database = 'disconnected';
      health.databaseError = error.message;
    }

    res.json(health);

  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Failed to fetch system health' });
  }
});

// Get audit log (placeholder - would need to implement audit logging)
router.get('/audit-log', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user, startDate, endDate } = req.query;

    // This is a placeholder implementation
    // In a real system, you would have an audit log collection
    const auditLog = [];

    res.json({
      logs: auditLog,
      total: auditLog.length,
      page: parseInt(page),
      pages: Math.ceil(auditLog.length / limit)
    });

  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ message: 'Failed to fetch audit log' });
  }
});

// Backup system data (placeholder)
router.post('/backup', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    // This is a placeholder implementation
    // In a real system, you would implement actual backup functionality
    const backupId = `backup_${Date.now()}`;
    
    res.json({
      message: 'Backup initiated successfully',
      backupId,
      status: 'in_progress',
      estimatedTime: '5-10 minutes'
    });

  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Failed to initiate backup' });
  }
});

// Get backup status
router.get('/backup/:backupId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { backupId } = req.params;
    
    // This is a placeholder implementation
    res.json({
      backupId,
      status: 'completed',
      createdAt: new Date(),
      size: '2.5 MB',
      downloadUrl: `/api/admin/backup/${backupId}/download`
    });

  } catch (error) {
    console.error('Get backup status error:', error);
    res.status(500).json({ message: 'Failed to fetch backup status' });
  }
});

module.exports = router;
