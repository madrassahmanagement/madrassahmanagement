const express = require('express');
const router = express.Router();
const DisciplineRecord = require('../models/DisciplineRecord');
const { authenticateToken } = require('../middleware/auth');

// Get all discipline records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, type, status, classId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (studentId) query.student = studentId;
    if (type) query.type = type;
    if (status) query.status = status;
    if (classId) query.className = classId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const records = await DisciplineRecord.find(query)
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
    console.error('Error fetching discipline records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discipline records'
    });
  }
});

// Get discipline record by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await DisciplineRecord.findById(req.params.id)
      .populate('student', 'studentId user')
      .populate('teacher', 'teacherId user')
      .populate('student.user', 'firstName lastName')
      .populate('teacher.user', 'firstName lastName');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Discipline record not found'
      });
    }
    
    res.json({
      success: true,
      record: record
    });
  } catch (error) {
    console.error('Error fetching discipline record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discipline record'
    });
  }
});

// Create new discipline record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      student,
      className,
      date,
      type,
      category,
      description,
      points,
      teacher
    } = req.body;

    const record = new DisciplineRecord({
      student,
      className,
      date: date || new Date(),
      type,
      category,
      description,
      points: points || 0,
      teacher,
      status: 'active',
      createdBy: req.user.id
    });

    await record.save();
    await record.populate('student', 'studentId user');
    await record.populate('teacher', 'teacherId user');
    await record.populate('student.user', 'firstName lastName');
    await record.populate('teacher.user', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Discipline record created successfully',
      record: record
    });
  } catch (error) {
    console.error('Error creating discipline record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create discipline record'
    });
  }
});

// Update discipline record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      category,
      description,
      points,
      status,
      resolution
    } = req.body;

    const updateData = {
      type,
      category,
      description,
      points,
      status,
      updatedAt: new Date()
    };

    if (status === 'resolved' && resolution) {
      updateData.resolution = resolution;
      updateData.resolvedBy = req.user.id;
      updateData.resolvedDate = new Date();
    }

    const record = await DisciplineRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('student', 'studentId user')
     .populate('teacher', 'teacherId user')
     .populate('student.user', 'firstName lastName')
     .populate('teacher.user', 'firstName lastName');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Discipline record not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipline record updated successfully',
      record: record
    });
  } catch (error) {
    console.error('Error updating discipline record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update discipline record'
    });
  }
});

// Delete discipline record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await DisciplineRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Discipline record not found'
      });
    }

    res.json({
      success: true,
      message: 'Discipline record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discipline record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete discipline record'
    });
  }
});

// Get student discipline summary
router.get('/student/:studentId/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = { student: req.params.studentId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const records = await DisciplineRecord.find(query);
    
    const summary = {
      totalRecords: records.length,
      positiveRecords: records.filter(r => r.type === 'positive').length,
      negativeRecords: records.filter(r => r.type === 'negative').length,
      totalPoints: records.reduce((acc, r) => acc + r.points, 0),
      activeRecords: records.filter(r => r.status === 'active').length,
      resolvedRecords: records.filter(r => r.status === 'resolved').length,
      escalatedRecords: records.filter(r => r.status === 'escalated').length
    };
    
    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    console.error('Error fetching discipline summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discipline summary'
    });
  }
});

module.exports = router;