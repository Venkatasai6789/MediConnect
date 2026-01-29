import express from 'express';
import { protect } from '../middleware/auth.js';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// @route   POST /api/payments/create
// @desc    Create payment intent
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { appointmentId, amount, paymentMethod } = req.body;
    
    // Verify appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Generate transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      appointment: appointmentId,
      amount,
      paymentMethod,
      transactionId,
      status: 'success', // In production, integrate with Stripe/Razorpay
      description: 'Consultation Fee'
    });
    
    // Update appointment
    appointment.payment = payment._id;
    await appointment.save();
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('appointment')
      .sort('-createdAt');
    
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('user', 'name email phone');
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    if (payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
