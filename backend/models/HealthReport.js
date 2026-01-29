import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  reportType: {
    type: String,
    enum: ['Consultation Report', 'Lab Report', 'X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'ECG', 'Blood Test'],
    required: true
  },
  title: String,
  description: String,
  findings: String,
  recommendations: String,
  fileUrl: String,
  reportDate: {
    type: Date,
    default: Date.now
  },
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    referenceRange: String,
    status: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Reviewed'],
    default: 'Pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedDate: Date
}, {
  timestamps: true
});

healthReportSchema.index({ patientId: 1, createdAt: -1 });

const HealthReport = mongoose.model('HealthReport', healthReportSchema);

export default HealthReport;
