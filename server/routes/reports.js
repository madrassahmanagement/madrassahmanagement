const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');

// Get all reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'firstName lastName email')
      .sort({ generatedAt: -1 });
    
    res.json({
      success: true,
      reports: reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports'
    });
  }
});

// Generate new report
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { type, dateRange, title } = req.body;
    
    const report = new Report({
      title: title || `${type} Report - ${new Date().toLocaleDateString()}`,
      type,
      dateRange,
      generatedBy: req.user.id,
      status: 'ready',
      generatedAt: new Date(),
      fileUrl: `/reports/${Date.now()}.pdf`
    });
    
    await report.save();
    
    res.json({
      success: true,
      message: 'Report generated successfully',
      report: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

module.exports = router;