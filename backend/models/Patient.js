import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  allergies: [String],
  medicalHistory: [String],
  height: Number, // in cm
  weight: Number, // in kg
  preferredLanguage: String,
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  },
  familyMembers: [{
    name: String,
    relation: String,
    age: Number
  }],
  appointmentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
