import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private/Patient
router.post('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, consultationType, reason, symptoms } = req.body;
    
    // Check if doctor exists
    const doctorExists = await User.findById(doctor);
    if (!doctorExists || doctorExists.role !== 'doctor') {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      'timeSlot.start': timeSlot.start,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'This time slot is not available' });
    }
    
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      timeSlot,
      consultationType,
      reason,
      symptoms
    });
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialty hospital profileImage consultationFee location')
      .populate('patient', 'name email phone profileImage');
    
    res.status(201).json({ success: true, data: populatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments (patient or doctor)
// @access  Private
router.get('/my-appointments', protect, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    let populateFields;
    
    if (req.user.role === 'patient') {
      query = { patient: req.user.id };
      populateFields = 'doctor';
    } else if (req.user.role === 'doctor') {
      query = { doctor: req.user.id };
      populateFields = 'patient';
    }
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate(populateFields, 'name specialty hospital profileImage consultationFee email phone')
      .sort('-appointmentDate');
    
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name specialty hospital profileImage consultationFee location')
      .populate('patient', 'name email phone profileImage dateOfBirth gender bloodType');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Check authorization
    if (appointment.patient._id.toString() !== req.user.id && 
        appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Doctor
router.put('/:id/status', protect, authorize('doctor'), async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.patient.toString() !== req.user.id && 
        appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.id;
    appointment.cancellationReason = req.body.reason;
    await appointment.save();
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
