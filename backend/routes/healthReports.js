import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import HealthReport from '../models/HealthReport.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/health-reports/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
  }
});

// @route   POST /api/health-reports
// @desc    Upload health report
// @access  Private/Patient
router.post('/', protect, authorize('patient'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    
    const { title, type, doctorOrLab, notes } = req.body;
    
    const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();
    const fileSize = (req.file.size / 1024 / 1024).toFixed(2) + ' MB';
    
    const healthReport = await HealthReport.create({
      patient: req.user.id,
      title,
      type,
      doctorOrLab,
      fileUrl: `/uploads/health-reports/${req.file.filename}`,
      fileType,
      fileSize,
      notes
    });
    
    res.status(201).json({ success: true, data: healthReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/health-reports
// @desc    Get user's health reports
// @access  Private/Patient
router.get('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = { patient: req.user.id };
    
    if (type && type !== 'All') {
      query.type = type;
    }
    
    const healthReports = await HealthReport.find(query).sort('-createdAt');
    
    res.json({ success: true, count: healthReports.length, data: healthReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/health-reports/:id
// @desc    Get health report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const healthReport = await HealthReport.findById(req.params.id);
    
    if (!healthReport) {
      return res.status(404).json({ success: false, message: 'Health report not found' });
    }
    
    if (healthReport.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: healthReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/health-reports/:id
// @desc    Delete health report
// @access  Private/Patient
router.delete('/:id', protect, authorize('patient'), async (req, res) => {
  try {
    const healthReport = await HealthReport.findById(req.params.id);
    
    if (!healthReport) {
      return res.status(404).json({ success: false, message: 'Health report not found' });
    }
    
    if (healthReport.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await healthReport.deleteOne();
    
    res.json({ success: true, message: 'Health report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
