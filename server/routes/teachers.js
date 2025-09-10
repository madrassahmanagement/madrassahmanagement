const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');

// Get all teachers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', 'firstName lastName email phone role')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      teachers: teachers
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teachers'
    });
  }
});

// Get teacher by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'firstName lastName email phone role');
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.json({
      success: true,
      teacher: teacher
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher'
    });
  }
});

// Create new teacher
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      teacherId,
      employeeNumber,
      joinDate,
      subjects,
      classes,
      qualification,
      experience,
      salary,
      status,
      user
    } = req.body;

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this ID already exists'
      });
    }

    const teacher = new Teacher({
      teacherId,
      employeeNumber,
      joinDate,
      subjects: subjects || [],
      classes: classes || [],
      qualification,
      experience: experience || 0,
      salary: salary || 0,
      status: status || 'active',
      user: user._id || user
    });

    await teacher.save();
    await teacher.populate('user', 'firstName lastName email phone role');

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      teacher: teacher
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create teacher'
    });
  }
});

// Update teacher
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      subjects,
      classes,
      qualification,
      experience,
      salary,
      status,
      performance,
      attendancePercentage
    } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      {
        subjects,
        classes,
        qualification,
        experience,
        salary,
        status,
        performance,
        attendancePercentage,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'firstName lastName email phone role');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: teacher
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher'
    });
  }
});

// Delete teacher (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'inactive',
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete teacher'
    });
  }
});

// Get teacher performance
router.get('/:id/performance', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Calculate performance metrics
    const performance = {
      overallScore: teacher.performance || 0,
      attendanceRate: teacher.attendancePercentage || 0,
      studentCount: teacher.classes ? teacher.classes.length * 25 : 0, // Assuming 25 students per class
      subjectCount: teacher.subjects ? teacher.subjects.length : 0,
      experience: teacher.experience || 0,
      salary: teacher.salary || 0
    };

    res.json({
      success: true,
      performance: performance
    });
  } catch (error) {
    console.error('Error fetching teacher performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher performance'
    });
  }
});

module.exports = router;