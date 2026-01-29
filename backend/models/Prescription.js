import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medicines: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    dosage: String,
    frequency: String,
    duration: String
  }],
  instructions: String,
  issuedDate: { type: Date, default: Date.now },
  expiryDate: Date
});

export default mongoose.model('Prescription', prescriptionSchema);
