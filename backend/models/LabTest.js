import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testName: String,
  testType: String,
  laboratory: String,
  scheduledDate: Date,
  results: {
    status: { type: String, enum: ['pending', 'completed', 'cancelled'] },
    report: String,
    remarks: String
  },
  cost: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('LabTest', labTestSchema);
