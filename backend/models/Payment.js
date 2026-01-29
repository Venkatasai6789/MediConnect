import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: String,
  stripePaymentId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
