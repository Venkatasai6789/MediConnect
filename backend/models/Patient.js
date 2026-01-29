import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  medicalHistory: [String],
  allergies: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
