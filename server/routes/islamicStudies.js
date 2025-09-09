const express = require('express');
const { body, validationResult } = require('express-validator');
const IslamicStudies = require('../models/IslamicStudies');
const Student = require('../models/Student');
const { authenticateToken, authorizeRole, canAccessStudent } = require('../middleware/auth');

const router = express.Router();

// Record Islamic studies progress for a student
router.post('/record', authenticateToken, authorizeRole('teacher', 'admin'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('classId').isMongoId().withMessage('Valid class ID is required'),
  body('section').notEmpty().withMessage('Section is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      studentId, 
      date, 
      classId, 
      section, 
      sabaq, 
      sabqi, 
      manzil, 
      wordOfTheDay, 
      dailyKnowledge, 
      tajweed, 
      memorization,
      teacherRemarks 
    } = req.body;

    const markedBy = req.user._id;

    // Verify student exists and is in the correct class
    const student = await Student.findOne({
      _id: studentId,
      currentClass: classId,
      section,
      status: 'active'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found in the specified class and section' });
    }

    // Check if record already exists for this date
    const existingRecord = await IslamicStudies.findOne({
      student: studentId,
      date: new Date(date)
    });

    if (existingRecord) {
      return res.status(400).json({ message: 'Islamic studies record already exists for this date' });
    }

    // Create new record
    const islamicStudiesRecord = new IslamicStudies({
      student: studentId,
      class: classId,
      section,
      date: new Date(date),
      sabaq: sabaq || {},
      sabqi: sabqi || {},
      manzil: manzil || {},
      wordOfTheDay: wordOfTheDay || {},
      dailyKnowledge: dailyKnowledge || {},
      tajweed: tajweed || {},
      memorization: memorization || {},
      overallPerformance: {
        teacherRemarks: teacherRemarks || ''
      },
      markedBy
    });

    await islamicStudiesRecord.save();

    res.status(201).json({
      message: 'Islamic studies progress recorded successfully',
      record: {
        id: islamicStudiesRecord._id,
        student: studentId,
        date: islamicStudiesRecord.date,
        overallPerformance: islamicStudiesRecord.overallPerformance
      }
    });

  } catch (error) {
    console.error('Record Islamic studies error:', error);
    res.status(500).json({ message: 'Failed to record Islamic studies progress', error: error.message });
  }
});

// Get Islamic studies record for a student on a specific date
router.get('/student/:studentId/:date', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId, date } = req.params;
    const recordDate = new Date(date);

    const record = await IslamicStudies.findOne({
      student: studentId,
      date: recordDate
    }).populate('student', 'studentId user currentClass section')
      .populate('student.user', 'firstName lastName')
      .populate('markedBy', 'firstName lastName');

    if (!record) {
      return res.status(404).json({ message: 'No Islamic studies record found for this date' });
    }

    res.json(record);

  } catch (error) {
    console.error('Get Islamic studies record error:', error);
    res.status(500).json({ message: 'Failed to fetch Islamic studies record' });
  }
});

// Get Islamic studies history for a student
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

    const records = await IslamicStudies.find(query)
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await IslamicStudies.countDocuments(query);

    // Get progress trends
    const progress = await IslamicStudies.getStudentProgress(studentId, 
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate ? new Date(endDate) : new Date()
    );

    res.json({
      records,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      progress
    });

  } catch (error) {
    console.error('Get Islamic studies history error:', error);
    res.status(500).json({ message: 'Failed to fetch Islamic studies history' });
  }
});

// Get class Islamic studies summary
router.get('/class/:classId/summary', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const { section, date } = req.query;

    const summaryDate = date ? new Date(date) : new Date();

    const summary = await IslamicStudies.getClassPerformanceSummary(classId, section, summaryDate);

    if (!summary) {
      return res.json({
        classId,
        section,
        date: summaryDate,
        summary: {
          totalStudents: 0,
          averageScore: 0,
          excellentCount: 0,
          goodCount: 0,
          needsImprovementCount: 0
        }
      });
    }

    res.json({
      classId,
      section,
      date: summaryDate,
      summary
    });

  } catch (error) {
    console.error('Get class Islamic studies summary error:', error);
    res.status(500).json({ message: 'Failed to fetch class Islamic studies summary' });
  }
});

// Update Islamic studies record
router.put('/:recordId', authenticateToken, authorizeRole('teacher', 'admin'), [
  body('sabaq').optional().isObject(),
  body('sabqi').optional().isObject(),
  body('manzil').optional().isObject(),
  body('tajweed').optional().isObject(),
  body('memorization').optional().isObject(),
  body('teacherRemarks').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sabaq, sabqi, manzil, tajweed, memorization, teacherRemarks } = req.body;
    const record = await IslamicStudies.findById(req.params.recordId);

    if (!record) {
      return res.status(404).json({ message: 'Islamic studies record not found' });
    }

    // Update fields
    if (sabaq) record.sabaq = { ...record.sabaq, ...sabaq };
    if (sabqi) record.sabqi = { ...record.sabqi, ...sabqi };
    if (manzil) record.manzil = { ...record.manzil, ...manzil };
    if (tajweed) record.tajweed = { ...record.tajweed, ...tajweed };
    if (memorization) record.memorization = { ...record.memorization, ...memorization };
    if (teacherRemarks !== undefined) record.overallPerformance.teacherRemarks = teacherRemarks;

    await record.save();

    res.json({
      message: 'Islamic studies record updated successfully',
      record: {
        id: record._id,
        student: record.student,
        date: record.date,
        overallPerformance: record.overallPerformance
      }
    });

  } catch (error) {
    console.error('Update Islamic studies record error:', error);
    res.status(500).json({ message: 'Failed to update Islamic studies record' });
  }
});

// Get students with poor Islamic studies performance
router.get('/poor-performance/:classId', authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const { section, date, threshold = 60 } = req.query;

    const summaryDate = date ? new Date(date) : new Date();

    // Get all students in the class
    const students = await Student.find({
      currentClass: classId,
      status: 'active',
      ...(section && { section })
    }).populate('user', 'firstName lastName');

    // Get Islamic studies records for the date
    const records = await IslamicStudies.find({
      student: { $in: students.map(s => s._id) },
      date: summaryDate
    });

    // Filter students with poor performance
    const poorPerformanceStudents = records
      .filter(record => record.overallPerformance.score < threshold)
      .map(record => {
        const student = students.find(s => s._id.toString() === record.student.toString());
        return {
          student: {
            id: student._id,
            studentId: student.studentId,
            name: `${student.user.firstName} ${student.user.lastName}`,
            section: student.section
          },
          performance: record.overallPerformance,
          sabaq: record.sabaq,
          sabqi: record.sabqi,
          manzil: record.manzil,
          tajweed: record.tajweed
        };
      });

    res.json({
      classId,
      section,
      date: summaryDate,
      threshold: parseInt(threshold),
      students: poorPerformanceStudents,
      total: poorPerformanceStudents.length
    });

  } catch (error) {
    console.error('Get poor performance students error:', error);
    res.status(500).json({ message: 'Failed to fetch poor performance students' });
  }
});

// Get Islamic studies analytics for a student
router.get('/analytics/:studentId', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = '30' } = req.query; // days

    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);
    const endDate = new Date();

    // Get progress trends
    const trends = await IslamicStudies.getStudentProgress(studentId, startDate, endDate);

    // Calculate statistics
    const totalDays = trends.length;
    const averageScore = totalDays > 0 
      ? trends.reduce((sum, record) => sum + record.overallPerformance.score, 0) / totalDays 
      : 0;

    // Performance distribution
    const performanceDistribution = {
      excellent: trends.filter(r => r.overallPerformance.grade === 'A+').length,
      good: trends.filter(r => ['A', 'B+'].includes(r.overallPerformance.grade)).length,
      average: trends.filter(r => ['B', 'C+'].includes(r.overallPerformance.grade)).length,
      needsImprovement: trends.filter(r => ['C', 'D', 'F'].includes(r.overallPerformance.grade)).length
    };

    // Subject-wise performance
    const subjectPerformance = {
      sabaq: {
        excellent: trends.filter(r => r.sabaq.performance === 'excellent').length,
        good: trends.filter(r => r.sabaq.performance === 'good').length,
        average: trends.filter(r => r.sabaq.performance === 'average').length,
        needsImprovement: trends.filter(r => r.sabaq.performance === 'needs_improvement').length
      },
      sabqi: {
        excellent: trends.filter(r => r.sabqi.performance === 'excellent').length,
        good: trends.filter(r => r.sabqi.performance === 'good').length,
        average: trends.filter(r => r.sabqi.performance === 'average').length,
        needsImprovement: trends.filter(r => r.sabqi.performance === 'needs_improvement').length
      },
      manzil: {
        excellent: trends.filter(r => r.manzil.performance === 'excellent').length,
        good: trends.filter(r => r.manzil.performance === 'good').length,
        average: trends.filter(r => r.manzil.performance === 'average').length,
        needsImprovement: trends.filter(r => r.manzil.performance === 'needs_improvement').length
      },
      tajweed: {
        excellent: trends.filter(r => r.tajweed.performance === 'excellent').length,
        good: trends.filter(r => r.tajweed.performance === 'good').length,
        average: trends.filter(r => r.tajweed.performance === 'average').length,
        needsImprovement: trends.filter(r => r.tajweed.performance === 'needs_improvement').length
      }
    };

    // Weekly performance
    const weeklyData = [];
    for (let i = 0; i < Math.ceil(totalDays / 7); i++) {
      const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(Math.min(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000, endDate.getTime()));
      
      const weekRecords = trends.filter(record => 
        record.date >= weekStart && record.date <= weekEnd
      );
      
      const weekAverage = weekRecords.length > 0 
        ? weekRecords.reduce((sum, record) => sum + record.overallPerformance.score, 0) / weekRecords.length
        : 0;
      
      weeklyData.push({
        week: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        averageScore: Math.round(weekAverage * 100) / 100,
        recordsCount: weekRecords.length
      });
    }

    res.json({
      studentId,
      period: { startDate, endDate, days: parseInt(period) },
      overall: {
        totalDays,
        averageScore: Math.round(averageScore * 100) / 100,
        performanceDistribution
      },
      subjectPerformance,
      weeklyData,
      trends: trends.map(record => ({
        date: record.date,
        overallPerformance: record.overallPerformance,
        sabaq: record.sabaq,
        sabqi: record.sabqi,
        manzil: record.manzil,
        tajweed: record.tajweed
      }))
    });

  } catch (error) {
    console.error('Get Islamic studies analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch Islamic studies analytics' });
  }
});

// Get daily Islamic knowledge (Word of the Day, Hadith, Dua)
router.get('/daily-knowledge/:date', authenticateToken, async (req, res) => {
  try {
    const { date } = req.params;
    const knowledgeDate = new Date(date);

    // This would typically come from a knowledge database or API
    // For now, we'll return sample data
    const dailyKnowledge = {
      date: knowledgeDate,
      wordOfTheDay: {
        arabic: 'السلام',
        english: 'Peace',
        urdu: 'امن',
        meaning: 'A state of tranquility and harmony',
        context: 'Used as a greeting meaning "peace be upon you"'
      },
      hadith: {
        text: 'The best of people are those who are most beneficial to others',
        reference: 'Sahih Bukhari',
        explanation: 'This hadith emphasizes the importance of helping and serving others in Islam'
      },
      dua: {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        english: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire',
        urdu: 'اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا',
        context: 'A comprehensive dua asking for goodness in both worlds'
      }
    };

    res.json(dailyKnowledge);

  } catch (error) {
    console.error('Get daily knowledge error:', error);
    res.status(500).json({ message: 'Failed to fetch daily knowledge' });
  }
});

module.exports = router;
