import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Blood Test', 'Urine Test', 'X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'ECG', 'COVID-19'],
    required: true
  },
  cost: Number,
  status: {
    type: String,
    enum: ['Scheduled', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  scheduledDate: Date,
  collectionDate: Date,
  reportDate: Date,
  reportUrl: String,
  labCenter: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  homeCollectionAvailable: Boolean,
  sampleCollectionDate: Date,
  requirements: [String],
  results: [{
    testName: String,
    value: String,
    unit: String,
    referenceRange: String,
    status: String
  }],
  notes: String,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }
}, {
  timestamps: true
});

const LabTest = mongoose.model('LabTest', labTestSchema);

export default LabTest;
