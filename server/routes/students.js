const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const { authenticateToken, authorizeRole, canAccessStudent } = require('../middleware/auth');

const router = express.Router();

// Get all students (Admin only)
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, section, status, search } = req.query;
    const query = {};

    // Filter by class
    if (classId) {
      query.currentClass = classId;
    }

    // Filter by section
    if (section) {
      query.section = section;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by name or student ID
    if (search) {
      const students = await Student.find(query)
        .populate('user', 'firstName lastName email phone')
        .populate('currentClass', 'name level');
      
      const filteredStudents = students.filter(student => {
        const fullName = `${student.user.firstName} ${student.user.lastName}`.toLowerCase();
        const studentId = student.studentId.toLowerCase();
        return fullName.includes(search.toLowerCase()) || studentId.includes(search.toLowerCase());
      });

      return res.json({
        students: filteredStudents.slice((page - 1) * limit, page * limit),
        total: filteredStudents.length,
        page: parseInt(page),
        pages: Math.ceil(filteredStudents.length / limit)
      });
    }

    const students = await Student.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('currentClass', 'name level')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      students,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:studentId', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .populate('user', 'firstName lastName email phone profilePicture')
      .populate('currentClass', 'name level sections')
      .populate('guardian.father')
      .populate('guardian.mother');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Failed to fetch student' });
  }
});

// Create new student
router.post('/', authenticateToken, authorizeRole('admin'), [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('currentClass').isMongoId().withMessage('Valid class is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('rollNumber').notEmpty().withMessage('Roll number is required'),
  body('guardian.father.name').notEmpty().withMessage('Father name is required'),
  body('guardian.father.phone').isMobilePhone().withMessage('Valid father phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, phone, currentClass, section, rollNumber, guardian, dateOfBirth, gender, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if class exists
    const classExists = await Class.findById(currentClass);
    if (!classExists) {
      return res.status(400).json({ message: 'Class not found' });
    }

    // Check if roll number already exists in the class
    const existingStudent = await Student.findOne({ 
      currentClass, 
      section, 
      rollNumber 
    });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists in this class and section' });
    }

    // Create user account
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: 'password123', // Default password, should be changed on first login
      role: 'student',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address
    });

    await user.save();

    // Generate student ID and admission number
    const studentId = `STU${Date.now()}`;
    const admissionNumber = `ADM${Date.now()}`;

    // Create student profile
    const student = new Student({
      user: user._id,
      studentId,
      admissionNumber,
      admissionDate: new Date(),
      currentClass,
      section,
      rollNumber,
      guardian,
      academicYear: new Date().getFullYear().toString()
    });

    await student.save();

    // Add student to class
    const classUpdated = await classExists.addStudent(section);
    if (!classUpdated) {
      return res.status(400).json({ message: 'Class is full' });
    }

    res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: student._id,
        studentId: student.studentId,
        admissionNumber: student.admissionNumber,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        class: classExists.name,
        section
      }
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Failed to create student' });
  }
});

// Update student
router.put('/:studentId', authenticateToken, canAccessStudent, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('section').optional().notEmpty(),
  body('rollNumber').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const student = await Student.findById(req.params.studentId).populate('user');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { firstName, lastName, phone, section, rollNumber, guardian, health } = req.body;

    // Update user information
    if (firstName) student.user.firstName = firstName;
    if (lastName) student.user.lastName = lastName;
    if (phone) student.user.phone = phone;
    await student.user.save();

    // Update student information
    if (section) student.section = section;
    if (rollNumber) student.rollNumber = rollNumber;
    if (guardian) student.guardian = { ...student.guardian, ...guardian };
    if (health) student.health = { ...student.health, ...health };

    await student.save();

    res.json({
      message: 'Student updated successfully',
      student: {
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
        phone: student.user.phone,
        section: student.section,
        rollNumber: student.rollNumber
      }
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Failed to update student' });
  }
});

// Get student attendance
router.get('/:studentId/attendance', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 30 } = req.query;
    
    const query = { student: req.params.studentId };
    
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
      req.params.studentId,
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
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

// Get student performance summary
router.get('/:studentId/performance', authenticateToken, canAccessStudent, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const studentId = req.params.studentId;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get attendance percentage
    const attendancePercentage = await Attendance.calculateAttendancePercentage(studentId, start, end);

    // Get namaz percentage (will be implemented when Namaz model is ready)
    const namazPercentage = 0; // Placeholder

    // Get Islamic studies performance (will be implemented when IslamicStudies model is ready)
    const islamicStudiesPerformance = 0; // Placeholder

    // Get discipline performance (will be implemented when Discipline model is ready)
    const disciplinePerformance = 0; // Placeholder

    // Calculate overall performance
    const overallPerformance = Math.round(
      (attendancePercentage * 0.3) + 
      (namazPercentage * 0.3) + 
      (islamicStudiesPerformance * 0.3) + 
      (disciplinePerformance * 0.1)
    );

    res.json({
      attendancePercentage,
      namazPercentage,
      islamicStudiesPerformance,
      disciplinePerformance,
      overallPerformance,
      period: {
        startDate: start,
        endDate: end
      }
    });

  } catch (error) {
    console.error('Get student performance error:', error);
    res.status(500).json({ message: 'Failed to fetch performance data' });
  }
});

// Promote student to next class
router.post('/:studentId/promote', authenticateToken, authorizeRole('admin'), [
  body('newClass').isMongoId().withMessage('Valid new class is required'),
  body('newSection').notEmpty().withMessage('New section is required'),
  body('newRollNumber').notEmpty().withMessage('New roll number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { newClass, newSection, newRollNumber } = req.body;
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if new class exists
    const newClassExists = await Class.findById(newClass);
    if (!newClassExists) {
      return res.status(400).json({ message: 'New class not found' });
    }

    // Check if new roll number already exists
    const existingStudent = await Student.findOne({ 
      currentClass: newClass, 
      section: newSection, 
      rollNumber: newRollNumber 
    });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists in the new class and section' });
    }

    // Update student class
    const oldClass = student.currentClass;
    const oldSection = student.section;

    student.previousClass = oldClass;
    student.currentClass = newClass;
    student.section = newSection;
    student.rollNumber = newRollNumber;
    student.promotionDate = new Date();

    await student.save();

    // Update class student counts
    const oldClassDoc = await Class.findById(oldClass);
    if (oldClassDoc) {
      await oldClassDoc.removeStudent(oldSection);
    }
    await newClassExists.addStudent(newSection);

    res.json({
      message: 'Student promoted successfully',
      student: {
        id: student._id,
        name: `${student.user.firstName} ${student.user.lastName}`,
        previousClass: oldClass,
        newClass: newClass,
        newSection,
        newRollNumber,
        promotionDate: student.promotionDate
      }
    });

  } catch (error) {
    console.error('Promote student error:', error);
    res.status(500).json({ message: 'Failed to promote student' });
  }
});

// Delete student (soft delete)
router.delete('/:studentId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Soft delete - change status to inactive
    student.status = 'inactive';
    await student.save();

    // Also deactivate user account
    const user = await User.findById(student.user);
    if (user) {
      user.isActive = false;
      await user.save();
    }

    res.json({ message: 'Student deactivated successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

module.exports = router;
