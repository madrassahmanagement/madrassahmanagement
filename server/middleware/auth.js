const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Check if user has required role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

// Check if user can access student data
const canAccessStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const user = req.user;

    // Admin can access all students
    if (user.role === 'admin') {
      return next();
    }

    // Teachers can access students in their classes
    if (user.role === 'teacher') {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findOne({ user: user._id });
      
      if (teacher) {
        const Student = require('../models/Student');
        const student = await Student.findById(studentId);
        
        if (student) {
          // Check if student is in teacher's assigned classes
          const isAssigned = teacher.assignedClasses.some(assignment => 
            assignment.class.toString() === student.currentClass.toString()
          );
          
          if (isAssigned || teacher.isHomeroomTeacher) {
            return next();
          }
        }
      }
    }

    // Parents can access their own children
    if (user.role === 'parent') {
      const Parent = require('../models/Parent');
      const parent = await Parent.findOne({ user: user._id });
      
      if (parent && parent.children.includes(studentId)) {
        return next();
      }
    }

    // Students can access their own data
    if (user.role === 'student') {
      const Student = require('../models/Student');
      const student = await Student.findOne({ user: user._id });
      
      if (student && student._id.toString() === studentId) {
        return next();
      }
    }

    return res.status(403).json({ message: 'Access denied to student data' });
  } catch (error) {
    return res.status(500).json({ message: 'Authorization error' });
  }
};

// Check if user can access class data
const canAccessClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const user = req.user;

    // Admin can access all classes
    if (user.role === 'admin') {
      return next();
    }

    // Teachers can access their assigned classes
    if (user.role === 'teacher') {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findOne({ user: user._id });
      
      if (teacher) {
        const isAssigned = teacher.assignedClasses.some(assignment => 
          assignment.class.toString() === classId
        );
        
        if (isAssigned || teacher.isHomeroomTeacher) {
          return next();
        }
      }
    }

    return res.status(403).json({ message: 'Access denied to class data' });
  } catch (error) {
    return res.status(500).json({ message: 'Authorization error' });
  }
};

// Rate limiting for login attempts
const loginRateLimit = (req, res, next) => {
  const { email } = req.body;
  const key = `login_attempts_${email}`;
  
  // This would typically use Redis or similar for production
  // For now, we'll rely on the express-rate-limit middleware
  next();
};

// Check if account is locked
const checkAccountLock = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user && user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts',
        lockUntil: user.lockUntil
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  canAccessStudent,
  canAccessClass,
  loginRateLimit,
  checkAccountLock
};
