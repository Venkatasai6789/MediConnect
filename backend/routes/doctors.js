import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import HealthReport from '../models/HealthReport.js';

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialty, search, sortBy = 'rating' } = req.query;
    let query = { role: 'doctor' };

    if (specialty) {
      query.specialty = specialty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    if (sortBy === 'rating') sortOptions.totalRating = -1;
    if (sortBy === 'experience') sortOptions.yearsOfExperience = -1;
    if (sortBy === 'fee') sortOptions.consultationFee = 1;

    const doctors = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(50);

    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/:id/availability
// @desc    Get doctor availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, data: doctor.availability || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/doctors/profile
// @desc    Update doctor profile (doctor only)
// @access  Private/Doctor
router.put('/profile', protect, authorize('doctor'), async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'profileImage', 'specialty', 'qualifications', 'experience', 'hospital', 'consultationFee', 'availability', 'location'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const doctor = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/:id/patients
// @desc    Get doctor's patients
// @access  Private/Doctor
router.get('/:id/patients', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.id })
      .populate('patient', 'name email phone gender bloodType dateOfBirth')
      .sort('-createdAt');
    
    // Get unique patients
    const patientsMap = new Map();
    appointments.forEach(apt => {
      if (apt.patient) {
        const patientId = apt.patient._id.toString();
        if (!patientsMap.has(patientId)) {
          patientsMap.set(patientId, {
            ...apt.patient.toObject(),
            lastVisit: apt.appointmentDate,
            status: apt.status === 'completed' ? 'Active' : 'Active'
          });
        }
      }
    });
    
    const patients = Array.from(patientsMap.values());
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/my/appointments
// @desc    Get doctor's appointments
// @access  Private/Doctor
router.get('/my/appointments', protect, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = { doctor: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone profileImage')
      .sort('-appointmentDate');
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/doctors/appointments/:appointmentId/status
// @desc    Update appointment status
// @access  Private/Doctor
router.put('/appointments/:appointmentId/status', protect, authorize('doctor'), async (req, res) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.appointmentId);

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/my/patients
// @desc    Get doctor's patients list
// @access  Private/Doctor
router.get('/my/patients', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone profileImage dateOfBirth gender bloodType')
      .sort('-createdAt');
    
    // Get unique patients
    const patientsMap = new Map();
    appointments.forEach(apt => {
      if (apt.patient && !patientsMap.has(apt.patient._id.toString())) {
        patientsMap.set(apt.patient._id.toString(), {
          ...apt.patient.toObject(),
          lastVisit: apt.appointmentDate,
          status: apt.status === 'completed' ? 'Recovered' : 'Active'
        });
      }
    });
    
    const patients = Array.from(patientsMap.values());
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/doctors/my/stats
// @desc    Get doctor dashboard stats
// @access  Private/Doctor
router.get('/my/stats', protect, authorize('doctor'), async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ doctor: req.user._id });
    const completedAppointments = await Appointment.countDocuments({
      doctor: req.user._id,
      status: 'completed'
    });
    
    const patients = await Appointment.distinct('patient', { doctor: req.user._id });
    
    res.json({
      success: true,
      data: {
        totalPatients: patients.length,
        totalAppointments,
        completedAppointments,
        upcomingAppointments: totalAppointments - completedAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
