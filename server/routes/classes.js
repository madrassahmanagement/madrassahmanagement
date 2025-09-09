const express = require('express');
const { body, validationResult } = require('express-validator');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, level, status, academicYear } = req.query;
    const query = {};

    if (level) {
      query.level = level;
    }

    if (status) {
      query.status = status;
    }

    if (academicYear) {
      query.academicYear = academicYear;
    }

    const classes = await Class.find(query)
      .populate('subjects.subject', 'name code type')
      .populate('subjects.teacher', 'user')
      .populate('subjects.teacher.user', 'firstName lastName')
      .sort({ level: 1, name: 1 });

    const total = classes.length;
    const paginatedClasses = classes.slice((page - 1) * limit, page * limit);

    res.json({
      classes: paginatedClasses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
});

// Get class by ID
router.get('/:classId', authenticateToken, async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.classId)
      .populate('subjects.subject', 'name code type')
      .populate('subjects.teacher', 'user')
      .populate('subjects.teacher.user', 'firstName lastName')
      .populate('sections.homeroomTeacher', 'user')
      .populate('sections.homeroomTeacher.user', 'firstName lastName');

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classDoc);

  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Failed to fetch class' });
  }
});

// Create new class
router.post('/', authenticateToken, authorizeRole('admin'), [
  body('name').notEmpty().withMessage('Class name is required'),
  body('level').isIn(['nursery', 'kg1', 'kg2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'hifz', 'tajweed', 'arabic', 'other']).withMessage('Valid level is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('maxStudents').optional().isInt({ min: 1, max: 100 }),
  body('sections').isArray().withMessage('Sections array is required'),
  body('sections.*.name').notEmpty().withMessage('Section name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, level, description, academicYear, maxStudents, sections, schedule, islamicStudies } = req.body;

    // Check if class already exists
    const existingClass = await Class.findOne({ name, academicYear });
    if (existingClass) {
      return res.status(400).json({ message: 'Class with this name already exists for the academic year' });
    }

    // Create new class
    const newClass = new Class({
      name,
      level,
      description,
      academicYear,
      maxStudents: maxStudents || 30,
      sections: sections.map(section => ({
        name: section.name,
        maxStudents: section.maxStudents || 30,
        currentStudents: 0
      })),
      schedule,
      islamicStudies
    });

    await newClass.save();

    res.status(201).json({
      message: 'Class created successfully',
      class: {
        id: newClass._id,
        name: newClass.name,
        level: newClass.level,
        academicYear: newClass.academicYear,
        sections: newClass.sections
      }
    });

  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Failed to create class' });
  }
});

// Update class
router.put('/:classId', authenticateToken, authorizeRole('admin'), [
  body('name').optional().notEmpty(),
  body('description').optional().isString(),
  body('maxStudents').optional().isInt({ min: 1, max: 100 }),
  body('schedule').optional().isObject(),
  body('islamicStudies').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const classDoc = await Class.findById(req.params.classId);
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const { name, description, maxStudents, schedule, islamicStudies } = req.body;

    // Update fields
    if (name) classDoc.name = name;
    if (description !== undefined) classDoc.description = description;
    if (maxStudents) classDoc.maxStudents = maxStudents;
    if (schedule) classDoc.schedule = { ...classDoc.schedule, ...schedule };
    if (islamicStudies) classDoc.islamicStudies = { ...classDoc.islamicStudies, ...islamicStudies };

    await classDoc.save();

    res.json({
      message: 'Class updated successfully',
      class: {
        id: classDoc._id,
        name: classDoc.name,
        level: classDoc.level,
        academicYear: classDoc.academicYear
      }
    });

  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Failed to update class' });
  }
});

// Add section to class
router.post('/:classId/sections', authenticateToken, authorizeRole('admin'), [
  body('name').notEmpty().withMessage('Section name is required'),
  body('maxStudents').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, maxStudents } = req.body;
    const classDoc = await Class.findById(req.params.classId);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if section already exists
    const existingSection = classDoc.sections.find(section => section.name === name);
    if (existingSection) {
      return res.status(400).json({ message: 'Section with this name already exists' });
    }

    // Add new section
    classDoc.sections.push({
      name,
      maxStudents: maxStudents || 30,
      currentStudents: 0
    });

    await classDoc.save();

    res.json({
      message: 'Section added successfully',
      section: {
        name,
        maxStudents: maxStudents || 30,
        currentStudents: 0
      }
    });

  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ message: 'Failed to add section' });
  }
});

// Assign subject to class
router.post('/:classId/subjects', authenticateToken, authorizeRole('admin'), [
  body('subjectId').isMongoId().withMessage('Valid subject ID is required'),
  body('teacherId').isMongoId().withMessage('Valid teacher ID is required'),
  body('weeklyHours').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subjectId, teacherId, weeklyHours } = req.body;
    const classDoc = await Class.findById(req.params.classId);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Check if teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check if subject is already assigned
    const existingSubject = classDoc.subjects.find(sub => sub.subject.toString() === subjectId);
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject is already assigned to this class' });
    }

    // Add subject
    classDoc.subjects.push({
      subject: subjectId,
      teacher: teacherId,
      weeklyHours: weeklyHours || 1
    });

    await classDoc.save();

    res.json({
      message: 'Subject assigned successfully',
      assignment: {
        subject: subjectId,
        teacher: teacherId,
        weeklyHours: weeklyHours || 1
      }
    });

  } catch (error) {
    console.error('Assign subject error:', error);
    res.status(500).json({ message: 'Failed to assign subject' });
  }
});

// Get class students
router.get('/:classId/students', authenticateToken, async (req, res) => {
  try {
    const { section, page = 1, limit = 30 } = req.query;
    const query = { currentClass: req.params.classId, status: 'active' };

    if (section) {
      query.section = section;
    }

    const students = await Student.find(query)
      .populate('user', 'firstName lastName email phone')
      .sort({ section: 1, rollNumber: 1 });

    const total = students.length;
    const paginatedStudents = students.slice((page - 1) * limit, page * limit);

    res.json({
      students: paginatedStudents,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ message: 'Failed to fetch class students' });
  }
});

// Get class performance
router.get('/:classId/performance', authenticateToken, async (req, res) => {
  try {
    const { section, startDate, endDate } = req.query;
    const classDoc = await Class.findById(req.params.classId);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Calculate class performance
    await classDoc.calculatePerformance();

    // Get students in the class
    const query = { currentClass: req.params.classId, status: 'active' };
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('user', 'firstName lastName')
      .select('user currentClass section overallPerformance attendancePercentage namazPercentage');

    res.json({
      class: {
        id: classDoc._id,
        name: classDoc.name,
        level: classDoc.level,
        section
      },
      period: { startDate: start, endDate: end },
      performance: classDoc.performanceMetrics,
      students: students.map(student => ({
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        section: student.section,
        overallPerformance: student.overallPerformance,
        attendancePercentage: student.attendancePercentage,
        namazPercentage: student.namazPercentage
      }))
    });

  } catch (error) {
    console.error('Get class performance error:', error);
    res.status(500).json({ message: 'Failed to fetch class performance' });
  }
});

// Get available sections
router.get('/:classId/sections/available', authenticateToken, async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.classId);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const availableSections = classDoc.getAvailableSections();

    res.json({
      classId: classDoc._id,
      availableSections
    });

  } catch (error) {
    console.error('Get available sections error:', error);
    res.status(500).json({ message: 'Failed to fetch available sections' });
  }
});

// Delete class
router.delete('/:classId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.classId);

    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if class has students
    if (classDoc.currentStudents > 0) {
      return res.status(400).json({ message: 'Cannot delete class with students. Please transfer students first.' });
    }

    // Soft delete - change status to archived
    classDoc.status = 'archived';
    await classDoc.save();

    res.json({ message: 'Class archived successfully' });

  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Failed to delete class' });
  }
});

module.exports = router;
