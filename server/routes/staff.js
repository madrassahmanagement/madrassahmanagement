const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all staff
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = { role: 'staff' };

    if (status) {
      query.isActive = status === 'active';
    }

    let users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Search by name if provided
    if (search) {
      users = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
    }

    const total = users.length;
    const paginatedUsers = users.slice((page - 1) * limit, page * limit);

    res.json({
      staff: paginatedUsers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// Get staff by ID
router.get('/:staffId', authenticateToken, async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId).select('-password');

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check access permissions
    if (req.user.role === 'staff' && staff._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(staff);

  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Failed to fetch staff member' });
  }
});

// Update staff profile
router.put('/:staffId', authenticateToken, [
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('address').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const staff = await User.findById(req.params.staffId);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check permissions
    if (req.user.role === 'staff' && staff._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { firstName, lastName, phone, address } = req.body;

    // Update fields
    if (firstName) staff.firstName = firstName;
    if (lastName) staff.lastName = lastName;
    if (phone) staff.phone = phone;
    if (address) staff.address = { ...staff.address, ...address };

    await staff.save();

    res.json({
      message: 'Staff profile updated successfully',
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role
      }
    });

  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ message: 'Failed to update staff profile' });
  }
});

// Deactivate staff member
router.put('/:staffId/deactivate', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.isActive = false;
    await staff.save();

    res.json({ message: 'Staff member deactivated successfully' });

  } catch (error) {
    console.error('Deactivate staff error:', error);
    res.status(500).json({ message: 'Failed to deactivate staff member' });
  }
});

// Reactivate staff member
router.put('/:staffId/reactivate', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.isActive = true;
    await staff.save();

    res.json({ message: 'Staff member reactivated successfully' });

  } catch (error) {
    console.error('Reactivate staff error:', error);
    res.status(500).json({ message: 'Failed to reactivate staff member' });
  }
});

module.exports = router;
