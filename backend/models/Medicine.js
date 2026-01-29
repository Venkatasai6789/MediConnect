import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  manufacturer: String,
  dosage: String,
  type: String,
  price: Number,
  description: String,
  sideEffects: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Medicine', medicineSchema);
