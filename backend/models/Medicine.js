import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  composition: String,
  manufacturer: String,
  category: {
    type: String,
    enum: ['Antibiotics', 'Pain Relief', 'Cold & Cough', 'Digestive', 'Vitamins', 'Skin Care', 'Other'],
    required: true
  },
  dosage: String,
  description: String,
  price: Number,
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  sideEffects: [String],
  precautions: [String],
  interactions: [String],
  storageInstructions: String,
  expiryDate: Date,
  imageUrl: String,
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

medicineSchema.index({ name: 'text', description: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
