const express = require('express');
const { body, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { authenticateToken, authorizeRole, canAccessClass } = require('../middleware/auth');

const router = express.Router();

// Mark attendance for a class
router.post('/mark', authenticateToken, authorizeRole('teacher', 'admin'), [
  body('classId').isMongoId().withMessage('Valid class ID is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('attendanceRecords').isArray().withMessage('Attendance records array is required'),
  body('attendanceRecords.*.studentId').isMongoId().withMessage('Valid student ID is required'),
  body('attendanceRecords.*.status').isIn(['present', 'absent', 'late', 'excused', 'sick']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { classId, section, date, attendanceRecords } = req.body;
    const markedBy = req.user._id;

    // Verify class access
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({
      class: classId,
      section,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendancePromises = attendanceRecords.map(async (record) => {
      const { studentId, status, checkInTime, checkOutTime, notes, lateMinutes, excuseReason } = record;

      // Verify student exists and is in the correct class
      const student = await Student.findOne({
        _id: studentId,
        currentClass: classId,
        section,
        status: 'active'
      });

      if (!student) {
        throw new Error(`Student ${studentId} not found in class ${classId}, section ${section}`);
      }

      const attendanceData = {
        student: studentId,
        class: classId,
        section,
        date: new Date(date),
        status,
        markedBy,
        notes
      };

      // Add check-in/out times if provided
      if (checkInTime) attendanceData.checkInTime = new Date(checkInTime);
      if (checkOutTime) attendanceData.checkOutTime = new Date(checkOutTime);

      // Add late details if status is late
      if (status === 'late') {
        attendanceData.lateDetails = {
          isLate: true,
          lateMinutes: lateMinutes || 0,
          reason: excuseReason || ''
        };
      }

      // Add excuse details if status is excused
      if (status === 'excused') {
        attendanceData.excuse = {
          reason: excuseReason || '',
          approvedBy: markedBy,
          approvedAt: new Date()
        };
      }

      return new Attendance(attendanceData).save();
    });

    const savedAttendance = await Promise.all(attendancePromises);

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: savedAttendance,
      summary: {
        total: savedAttendance.length,
        present: savedAttendance.filter(a => a.status === 'present').length,
        absent: savedAttendance.filter(a => a.status === 'absent').length,
        late: savedAttendance.filter(a => a.status === 'late').length,
        excused: savedAttendance.filter(a => a.status === 'excused').length,
        sick: savedAttendance.filter(a => a.status === 'sick').length
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});

// Get attendance for a class on a specific date
router.get('/class/:classId/:section/:date', authenticateToken, canAccessClass, async (req, res) => {
  try {
    const { classId, section, date } = req.params;
    const attendanceDate = new Date(date);

    const attendance = await Attendance.find({
      class: classId,
      section,
      date: attendanceDate
    })
    .populate('student', 'studentId user currentClass section')
    .populate('student.user', 'firstName lastName')
    .populate('markedBy', 'firstName lastName');

    const summary = await Attendance.getClassAttendanceSummary(classId, section, attendanceDate);

    res.json({
      attendance,
      summary,
      date: attendanceDate
    });

  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// Get attendance for a student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    // Verify student access
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check access permissions
    if (req.user.role === 'parent') {
      const Parent = require('../models/Parent');
      const parent = await Parent.findOne({ user: req.user._id });
      if (!parent || !parent.children.includes(studentId)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'student' && student.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const query = { student: studentId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    // Calculate attendance percentage
    const attendancePercentage = await Attendance.calculateAttendancePercentage(
      studentId,
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate) : new Date()
    );

    res.json({
      attendance,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      attendancePercentage
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// Update attendance record
router.put('/:attendanceId', authenticateToken, authorizeRole('teacher', 'admin'), [
  body('status').optional().isIn(['present', 'absent', 'late', 'excused', 'sick']),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, notes, checkInTime, checkOutTime, lateMinutes, excuseReason } = req.body;
    const attendance = await Attendance.findById(req.params.attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Update fields
    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;
    if (checkInTime) attendance.checkInTime = new Date(checkInTime);
    if (checkOutTime) attendance.checkOutTime = new Date(checkOutTime);

    // Update late details
    if (status === 'late' && lateMinutes !== undefined) {
      attendance.lateDetails = {
        isLate: true,
        lateMinutes,
        reason: excuseReason || attendance.lateDetails?.reason || ''
      };
    }

    // Update excuse details
    if (status === 'excused' && excuseReason) {
      attendance.excuse = {
        reason: excuseReason,
        approvedBy: req.user._id,
        approvedAt: new Date()
      };
    }

    await attendance.save();

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});

// Get attendance summary for a class over a period
router.get('/summary/class/:classId', authenticateToken, canAccessClass, async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate, section } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const query = {
      class: classId,
      date: { $gte: start, $lte: end }
    };

    if (section) {
      query.section = section;
    }

    const pipeline = [
      { $match: query },
      {
        $group: {
          _id: {
            date: '$date',
            section: '$section'
          },
          totalStudents: { $sum: 1 },
          present: {
            $sum: {
              $cond: [
                { $in: ['$status', ['present', 'late']] },
                1,
                0
              ]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          late: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          excused: {
            $sum: {
              $cond: [{ $eq: ['$status', 'excused'] }, 1, 0]
            }
          },
          sick: {
            $sum: {
              $cond: [{ $eq: ['$status', 'sick'] }, 1, 0]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          averageAttendance: {
            $avg: {
              $multiply: [
                { $divide: ['$present', '$totalStudents'] },
                100
              ]
            }
          },
          totalPresent: { $sum: '$present' },
          totalAbsent: { $sum: '$absent' },
          totalLate: { $sum: '$late' },
          totalExcused: { $sum: '$excused' },
          totalSick: { $sum: '$sick' }
        }
      }
    ];

    const result = await Attendance.aggregate(pipeline);
    const summary = result.length > 0 ? result[0] : {
      totalDays: 0,
      averageAttendance: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalExcused: 0,
      totalSick: 0
    };

    res.json({
      summary,
      period: {
        startDate: start,
        endDate: end
      }
    });

  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance summary' });
  }
});

// Get students with poor attendance
router.get('/poor-attendance/:classId', authenticateToken, canAccessClass, async (req, res) => {
  try {
    const { classId } = req.params;
    const { section, threshold = 70, days = 30 } = req.query;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Get all students in the class
    const students = await Student.find({
      currentClass: classId,
      status: 'active',
      ...(section && { section })
    }).populate('user', 'firstName lastName');

    // Calculate attendance percentage for each student
    const studentsWithAttendance = await Promise.all(
      students.map(async (student) => {
        const attendancePercentage = await Attendance.calculateAttendancePercentage(
          student._id,
          startDate,
          endDate
        );

        return {
          student: {
            id: student._id,
            studentId: student.studentId,
            name: `${student.user.firstName} ${student.user.lastName}`,
            section: student.section
          },
          attendancePercentage
        };
      })
    );

    // Filter students with poor attendance
    const poorAttendanceStudents = studentsWithAttendance.filter(
      item => item.attendancePercentage < threshold
    );

    res.json({
      students: poorAttendanceStudents,
      threshold: parseInt(threshold),
      period: {
        startDate,
        endDate,
        days: parseInt(days)
      }
    });

  } catch (error) {
    console.error('Get poor attendance error:', error);
    res.status(500).json({ message: 'Failed to fetch poor attendance data' });
  }
});

module.exports = router;
