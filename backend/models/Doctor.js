import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialties: [{
    type: String,
    required: true
  }],
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  yearsOfExperience: {
    type: Number,
    required: true
  },
  hospital: String,
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  consultationFee: {
    videocall: Number,
    inClinic: Number
  },
  languages: [String],
  availability: [{
    dayOfWeek: Number, // 0-6 (Sunday-Saturday)
    slots: [{
      startTime: String, // HH:MM format
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  totalRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  patientsCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: String, // URLs to license, qualifications, etc.
    documentType: String
  }],
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  bio: String
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
