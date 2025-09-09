const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const { authenticateToken, checkAccountLock } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent', 'staff']).withMessage('Valid role is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Valid date of birth is required'),
  body('gender').optional().isIn(['male', 'female']).withMessage('Valid gender is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, phone, role, dateOfBirth, gender, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address
    });

    await user.save();

    // Create role-specific profile
    let profile = null;
    switch (role) {
      case 'student':
        profile = await createStudentProfile(user._id, req.body);
        break;
      case 'teacher':
        profile = await createTeacherProfile(user._id, req.body);
        break;
      case 'parent':
        profile = await createParentProfile(user._id, req.body);
        break;
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profile: profile ? profile._id : null
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], checkAccountLock, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked',
        lockUntil: user.lockUntil
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case 'student':
        profile = await Student.findOne({ user: user._id });
        break;
      case 'teacher':
        profile = await Teacher.findOne({ user: user._id });
        break;
      case 'parent':
        profile = await Parent.findOne({ user: user._id });
        break;
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profile: profile ? profile._id : null,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    // Get role-specific profile
    switch (user.role) {
      case 'student':
        profile = await Student.findOne({ user: user._id })
          .populate('currentClass', 'name level')
          .populate('user', 'firstName lastName email phone');
        break;
      case 'teacher':
        profile = await Teacher.findOne({ user: user._id })
          .populate('assignedClasses.class', 'name level')
          .populate('user', 'firstName lastName email phone');
        break;
      case 'parent':
        profile = await Parent.findOne({ user: user._id })
          .populate('children', 'studentId currentClass section')
          .populate('children.currentClass', 'name level')
          .populate('children.user', 'firstName lastName')
          .populate('user', 'firstName lastName email phone');
        break;
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        language: user.language,
        lastLogin: user.lastLogin
      },
      profile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('language').optional().isIn(['en', 'ur', 'ar'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, phone, language, address } = req.body;
    const user = req.user;

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (language) user.language = language;
    if (address) user.address = address;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Profile update failed' });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Password change failed' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Helper function to create student profile
async function createStudentProfile(userId, data) {
  const { studentId, admissionNumber, currentClass, section, rollNumber, guardian } = data;
  
  const student = new Student({
    user: userId,
    studentId: studentId || `STU${Date.now()}`,
    admissionNumber: admissionNumber || `ADM${Date.now()}`,
    admissionDate: new Date(),
    currentClass,
    section,
    rollNumber,
    guardian
  });

  return await student.save();
}

// Helper function to create teacher profile
async function createTeacherProfile(userId, data) {
  const { teacherId, employeeId, qualification, subjects, assignedClasses } = data;
  
  const teacher = new Teacher({
    user: userId,
    teacherId: teacherId || `TCH${Date.now()}`,
    employeeId: employeeId || `EMP${Date.now()}`,
    joiningDate: new Date(),
    qualification,
    subjects,
    assignedClasses
  });

  return await teacher.save();
}

// Helper function to create parent profile
async function createParentProfile(userId, data) {
  const { parentId, relationship, children } = data;
  
  const parent = new Parent({
    user: userId,
    parentId: parentId || `PAR${Date.now()}`,
    relationship,
    children: children || []
  });

  return await parent.save();
}

module.exports = router;
