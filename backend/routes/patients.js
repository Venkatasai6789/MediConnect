import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import HealthReport from '../models/HealthReport.js';

const router = express.Router();

// @route   GET /api/patients/profile
// @desc    Get patient profile
// @access  Private/Patient
router.get('/profile', protect, authorize('patient'), async (req, res) => {
  try {
    const patient = await User.findById(req.user.id);
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/patients/stats
// @desc    Get patient dashboard stats
// @access  Private/Patient
router.get('/stats', protect, authorize('patient'), async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ patient: req.user.id });
    const upcomingAppointments = await Appointment.countDocuments({
      patient: req.user.id,
      status: { $in: ['pending', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });
    const completedAppointments = await Appointment.countDocuments({
      patient: req.user.id,
      status: 'completed'
    });
    
    res.json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        completedAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/patients/history
// @desc    Get patient appointment history
// @access  Private/Patient
router.get('/history', protect, authorize('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialty hospital profileImage')
      .populate('prescription')
      .sort('-appointmentDate');
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
