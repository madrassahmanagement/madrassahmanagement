const express = require('express');
const router = express.Router();
const FitnessRecord = require('../models/FitnessRecord');
const { authenticateToken } = require('../middleware/auth');

// Get all fitness records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, activity, intensity, classId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (studentId) query.student = studentId;
    if (activity) query.activity = activity;
    if (intensity) query.intensity = intensity;
    if (classId) query.className = classId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const records = await FitnessRecord.find(query)
      .populate('student', 'studentId user')
      .populate('teacher', 'teacherId user')
      .populate('student.user', 'firstName lastName')
      .populate('teacher.user', 'firstName lastName')
      .sort({ date: -1 });
    
    res.json({
      success: true,
      records: records
    });
  } catch (error) {
    console.error('Error fetching fitness records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness records'
    });
  }
});

// Get fitness record by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await FitnessRecord.findById(req.params.id)
      .populate('student', 'studentId user')
      .populate('teacher', 'teacherId user')
      .populate('student.user', 'firstName lastName')
      .populate('teacher.user', 'firstName lastName');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fitness record not found'
      });
    }
    
    res.json({
      success: true,
      record: record
    });
  } catch (error) {
    console.error('Error fetching fitness record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness record'
    });
  }
});

// Create new fitness record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      student,
      className,
      date,
      activity,
      duration,
      intensity,
      calories,
      notes,
      teacher,
      weight,
      height,
      bmi
    } = req.body;

    const record = new FitnessRecord({
      student,
      className,
      date: date || new Date(),
      activity,
      duration: duration || 0,
      intensity,
      calories: calories || 0,
      notes: notes || '',
      teacher,
      weight,
      height,
      bmi,
      createdBy: req.user.id
    });

    await record.save();
    await record.populate('student', 'studentId user');
    await record.populate('teacher', 'teacherId user');
    await record.populate('student.user', 'firstName lastName');
    await record.populate('teacher.user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Fitness record created successfully',
      record: record
    });
  } catch (error) {
    console.error('Error creating fitness record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create fitness record'
    });
  }
});

// Update fitness record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      activity,
      duration,
      intensity,
      calories,
      notes,
      weight,
      height,
      bmi
    } = req.body;

    const record = await FitnessRecord.findByIdAndUpdate(
      req.params.id,
      {
        activity,
        duration,
        intensity,
        calories,
        notes,
        weight,
        height,
        bmi,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('student', 'studentId user')
     .populate('teacher', 'teacherId user')
     .populate('student.user', 'firstName lastName')
     .populate('teacher.user', 'firstName lastName');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fitness record not found'
      });
    }

    res.json({
      success: true,
      message: 'Fitness record updated successfully',
      record: record
    });
  } catch (error) {
    console.error('Error updating fitness record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update fitness record'
    });
  }
});

// Delete fitness record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await FitnessRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Fitness record not found'
      });
    }

    res.json({
      success: true,
      message: 'Fitness record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fitness record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete fitness record'
    });
  }
});

// Get student fitness summary
router.get('/student/:studentId/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { student: req.params.studentId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const records = await FitnessRecord.find(query);
    
    const summary = {
      totalActivities: records.length,
      totalDuration: records.reduce((acc, r) => acc + r.duration, 0),
      totalCalories: records.reduce((acc, r) => acc + r.calories, 0),
      avgDuration: records.length > 0 ? records.reduce((acc, r) => acc + r.duration, 0) / records.length : 0,
      avgCalories: records.length > 0 ? records.reduce((acc, r) => acc + r.calories, 0) / records.length : 0,
      highIntensityCount: records.filter(r => r.intensity === 'high').length,
      mediumIntensityCount: records.filter(r => r.intensity === 'medium').length,
      lowIntensityCount: records.filter(r => r.intensity === 'low').length,
      activities: [...new Set(records.map(r => r.activity))],
      avgBMI: records.length > 0 ? records.reduce((acc, r) => acc + (r.bmi || 0), 0) / records.length : 0
    };
    
    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching fitness summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness summary'
    });
  }
});

// Get fitness analytics
router.get('/analytics/overview', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, classId } = req.query;
    
    let query = {};
    
    if (classId) query.className = classId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const records = await FitnessRecord.find(query);
    
    const analytics = {
      totalRecords: records.length,
      totalStudents: new Set(records.map(r => r.student.toString())).size,
      totalDuration: records.reduce((acc, r) => acc + r.duration, 0),
      totalCalories: records.reduce((acc, r) => acc + r.calories, 0),
      avgDuration: records.length > 0 ? records.reduce((acc, r) => acc + r.duration, 0) / records.length : 0,
      avgCalories: records.length > 0 ? records.reduce((acc, r) => acc + r.calories, 0) / records.length : 0,
      intensityDistribution: {
        high: records.filter(r => r.intensity === 'high').length,
        medium: records.filter(r => r.intensity === 'medium').length,
        low: records.filter(r => r.intensity === 'low').length
      },
      topActivities: getTopActivities(records),
      avgBMI: records.length > 0 ? records.reduce((acc, r) => acc + (r.bmi || 0), 0) / records.length : 0
    };
    
    res.json({
      success: true,
      analytics: analytics
    });
  } catch (error) {
    console.error('Error fetching fitness analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness analytics'
    });
  }
});

// Helper function to get top activities
function getTopActivities(records) {
  const activityCount = {};
  records.forEach(record => {
    activityCount[record.activity] = (activityCount[record.activity] || 0) + 1;
  });
  
  return Object.entries(activityCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));
}

module.exports = router;