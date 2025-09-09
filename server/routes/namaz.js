const express = require('express');
const { body, validationResult } = require('express-validator');
const Namaz = require('../models/Namaz');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { authenticateToken, authorizeRole, canAccessStudent } = require('../middleware/auth');

const router = express.Router();

// Mark Namaz for a student
router.post('/mark', authenticateToken, authorizeRole('teacher', 'admin', 'parent'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('prayer').isIn(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']).withMessage('Valid prayer name is required'),
  body('performed').isBoolean().withMessage('Performed status is required'),
  body('location').optional().isIn(['madrassah', 'home', 'other']),
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

    const { studentId, date, prayer, performed, location = 'madrassah', notes } = req.body;
    const markedBy = req.user._id;

    // Verify student access
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check parent access
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user._id });
      if (!parent || !parent.children.includes(studentId)) {
        return res.status(403).json({ message: 'Access denied to student data' });
      }
    }

    // Find or create Namaz record for the date
    let namazRecord = await Namaz.findOne({
      student: studentId,
      date: new Date(date)
    });

    if (!namazRecord) {
      namazRecord = new Namaz({
        student: studentId,
        date: new Date(date)
      });
    }

    // Mark the specific prayer
    if (performed) {
      await namazRecord.markPrayer(prayer, location, markedBy, notes);
    } else {
      // If not performed, just update the status
      namazRecord.prayers[prayer] = {
        performed: false,
        location: 'madrassah',
        time: null,
        markedBy: markedBy,
        notes: notes || ''
      };
    }

    // Check if parent should be notified for missed prayers
    const missedPrayers = namazRecord.getMissedPrayers();
    if (missedPrayers.length > 0 && !namazRecord.notifications.parentNotified) {
      // Send notification to parent (implementation depends on notification system)
      namazRecord.notifications.parentNotified = true;
      namazRecord.notifications.notificationSentAt = new Date();
    }

    await namazRecord.save();

    res.json({
      message: 'Namaz marked successfully',
      namaz: {
        student: studentId,
        date: namazRecord.date,
        prayer,
        performed,
        location,
        summary: namazRecord.summary
      }
    });

  } catch (error) {
    console.error('Mark Namaz error:', error);
    res.status(500).json({ message: 'Failed to mark Namaz', error: error.message });
  }
});

// Get Namaz record for a student on a specific date
router.get('/student/:studentId/:date', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const namazDate = new Date(date);

    const namaz = await Namaz.findOne({
      student: studentId,
      date: namazDate
    }).populate('student', 'studentId user currentClass section')
      .populate('student.user', 'firstName lastName');

    if (!namaz) {
      // Return empty record if no data exists
      return res.json({
        student: studentId,
        date: namazDate,
        prayers: {
          fajr: { performed: false, location: 'madrassah', time: null, markedBy: null, notes: '' },
          dhuhr: { performed: false, location: 'madrassah', time: null, markedBy: null, notes: '' },
          asr: { performed: false, location: 'madrassah', time: null, markedBy: null, notes: '' },
          maghrib: { performed: false, location: 'madrassah', time: null, markedBy: null, notes: '' },
          isha: { performed: false, location: 'madrassah', time: null, markedBy: null, notes: '' }
        },
        summary: {
          totalPerformed: 0,
          madrassahCount: 0,
          homeCount: 0,
          missedCount: 5,
          percentage: 0
        }
      });
    }

    res.json(namaz);

  } catch (error) {
    console.error('Get Namaz error:', error);
    res.status(500).json({ message: 'Failed to fetch Namaz data' });
  }
});

// Get Namaz history for a student
router.get('/student/:studentId/history', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, page = 1, limit = 30 } = req.query;

    const query = { student: studentId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const namazHistory = await Namaz.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Namaz.countDocuments(query);

    // Calculate Namaz percentage for the period
    const namazPercentage = await Namaz.calculateNamazPercentage(
      studentId,
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate) : new Date()
    );

    res.json({
      namazHistory,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      namazPercentage
    });

  } catch (error) {
    console.error('Get Namaz history error:', error);
    res.status(500).json({ message: 'Failed to fetch Namaz history' });
  }
});

// Get students with missed prayers for a specific date
router.get('/missed/:date', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { date } = req.params;
    const namazDate = new Date(date);

    const studentsWithMissedPrayers = await Namaz.getStudentsWithMissedPrayers(namazDate);

    res.json({
      date: namazDate,
      students: studentsWithMissedPrayers,
      total: studentsWithMissedPrayers.length
    });

  } catch (error) {
    console.error('Get missed prayers error:', error);
    res.status(500).json({ message: 'Failed to fetch students with missed prayers' });
  }
});

// Get Namaz summary for a class
router.get('/class/:classId/summary', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const { section, startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get all students in the class
    const students = await Student.find({
      currentClass: classId,
      status: 'active',
      ...(section && { section })
    });

    const studentIds = students.map(student => student._id);

    // Get Namaz records for all students
    const namazRecords = await Namaz.find({
      student: { $in: studentIds },
      date: { $gte: start, $lte: end }
    });

    // Calculate class summary
    const totalDays = namazRecords.length;
    const totalPrayers = totalDays * 5; // 5 prayers per day
    const totalPerformed = namazRecords.reduce((sum, record) => sum + record.summary.totalPerformed, 0);
    const totalMadrassah = namazRecords.reduce((sum, record) => sum + record.summary.madrassahCount, 0);
    const totalHome = namazRecords.reduce((sum, record) => sum + record.summary.homeCount, 0);
    const totalMissed = namazRecords.reduce((sum, record) => sum + record.summary.missedCount, 0);

    const classPercentage = totalPrayers > 0 ? (totalPerformed / totalPrayers) * 100 : 0;

    // Get individual student performance
    const studentPerformance = await Promise.all(
      students.map(async (student) => {
        const studentNamazPercentage = await Namaz.calculateNamazPercentage(
          student._id,
          start,
          end
        );

        return {
          studentId: student.studentId,
          name: `${student.user.firstName} ${student.user.lastName}`,
          section: student.section,
          namazPercentage: studentNamazPercentage
        };
      })
    );

    res.json({
      classId,
      section,
      period: { startDate: start, endDate: end },
      summary: {
        totalStudents: students.length,
        totalDays,
        totalPrayers,
        totalPerformed,
        totalMadrassah,
        totalHome,
        totalMissed,
        classPercentage: Math.round(classPercentage * 100) / 100
      },
      studentPerformance
    });

  } catch (error) {
    console.error('Get class Namaz summary error:', error);
    res.status(500).json({ message: 'Failed to fetch class Namaz summary' });
  }
});

// Get Namaz analytics for a student
router.get('/analytics/:studentId', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = '30' } = req.query; // days

    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Get Namaz trends
    const trends = await Namaz.getFitnessTrends(studentId, startDate, endDate);

    // Calculate statistics
    const totalDays = trends.length;
    const totalPrayers = totalDays * 5;
    const totalPerformed = trends.reduce((sum, record) => sum + record.summary.totalPerformed, 0);
    const totalMadrassah = trends.reduce((sum, record) => sum + record.summary.madrassahCount, 0);
    const totalHome = trends.reduce((sum, record) => sum + record.summary.homeCount, 0);

    // Prayer-wise performance
    const prayerStats = {
      fajr: { performed: 0, total: totalDays },
      dhuhr: { performed: 0, total: totalDays },
      asr: { performed: 0, total: totalDays },
      maghrib: { performed: 0, total: totalDays },
      isha: { performed: 0, total: totalDays }
    };

    trends.forEach(record => {
      Object.keys(prayerStats).forEach(prayer => {
        if (record.prayers[prayer] && record.prayers[prayer].performed) {
          prayerStats[prayer].performed++;
        }
      });
    });

    // Calculate percentages
    Object.keys(prayerStats).forEach(prayer => {
      prayerStats[prayer].percentage = totalDays > 0 
        ? Math.round((prayerStats[prayer].performed / prayerStats[prayer].total) * 100)
        : 0;
    });

    // Weekly performance
    const weeklyData = [];
    for (let i = 0; i < Math.ceil(totalDays / 7); i++) {
      const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Math.min(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000, endDate.getTime()));
      
      const weekRecords = trends.filter(record => 
        record.date >= weekStart && record.date <= weekEnd
      );
      
      const weekPrayers = weekRecords.length * 5;
      const weekPerformed = weekRecords.reduce((sum, record) => sum + record.summary.totalPerformed, 0);
      
      weeklyData.push({
        week: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        totalPrayers: weekPrayers,
        performed: weekPerformed,
        percentage: weekPrayers > 0 ? Math.round((weekPerformed / weekPrayers) * 100) : 0
      });
    }

    res.json({
      studentId,
      period: { startDate, endDate, days: parseInt(period) },
      overall: {
        totalDays,
        totalPrayers,
        totalPerformed,
        totalMadrassah,
        totalHome,
        percentage: totalPrayers > 0 ? Math.round((totalPerformed / totalPrayers) * 100) : 0
      },
      prayerStats,
      weeklyData,
      trends: trends.map(record => ({
        date: record.date,
        summary: record.summary
      }))
    });

  } catch (error) {
    console.error('Get Namaz analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch Namaz analytics' });
  }
});

// Mark multiple prayers at once (for teachers)
router.post('/mark-multiple', authenticateToken, authorizeRole('teacher', 'admin'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('prayers').isObject().withMessage('Prayers object is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { studentId, date, prayers } = req.body;
    const markedBy = req.user._id;

    // Find or create Namaz record
    let namazRecord = await Namaz.findOne({
      student: studentId,
      date: new Date(date)
    });

    if (!namazRecord) {
      namazRecord = new Namaz({
        student: studentId,
        date: new Date(date)
      });
    }

    // Update each prayer
    const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const prayer of prayerNames) {
      if (prayers[prayer]) {
        const { performed, location = 'madrassah', notes = '' } = prayers[prayer];
        
        if (performed) {
          await namazRecord.markPrayer(prayer, location, markedBy, notes);
        } else {
          namazRecord.prayers[prayer] = {
            performed: false,
            location: 'madrassah',
            time: null,
            markedBy: markedBy,
            notes: notes
          };
        }
      }
    }

    await namazRecord.save();

    res.json({
      message: 'Multiple prayers marked successfully',
      namaz: {
        student: studentId,
        date: namazRecord.date,
        summary: namazRecord.summary
      }
    });

  } catch (error) {
    console.error('Mark multiple prayers error:', error);
    res.status(500).json({ message: 'Failed to mark multiple prayers', error: error.message });
  }
});

module.exports = router;
