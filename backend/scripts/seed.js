// Seed database with initial data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Seed users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed_password',
        role: 'patient'
      },
      {
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        password: 'hashed_password',
        role: 'doctor'
      }
    ]);

    console.log(`✅ Seeded ${users.length} users`);

    await mongoose.disconnect();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
