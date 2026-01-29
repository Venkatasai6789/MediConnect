import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import LabTest from '../models/LabTest.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({ role: 'doctor' });
    await Medicine.deleteMany({});
    await LabTest.deleteMany({});
    
    console.log('👨‍⚕️  Creating doctors...');
    const doctors = await User.insertMany([
      {
        name: 'Dr. Anjali Desai',
        email: 'anjali.desai@mediconnect.com',
        phone: '+919876543210',
        password: 'password123',
        role: 'doctor',
        specialty: 'General Physician',
        qualifications: ['MBBS', 'MD'],
        experience: 12,
        hospital: 'Apollo Hospital',
        consultationFee: 800,
        rating: 4.8,
        reviewsCount: 124,
        location: {
          address: 'Indiranagar, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          coordinates: { latitude: 12.9716, longitude: 77.5946 }
        },
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Dr. Robert Smith',
        email: 'robert.smith@mediconnect.com',
        phone: '+919876543211',
        password: 'password123',
        role: 'doctor',
        specialty: 'General Physician',
        qualifications: ['MBBS'],
        experience: 8,
        hospital: 'City Clinic',
        consultationFee: 600,
        rating: 4.6,
        reviewsCount: 89,
        location: {
          address: 'Koramangala, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka'
        },
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Dr. Susan Lee',
        email: 'susan.lee@mediconnect.com',
        phone: '+919876543212',
        password: 'password123',
        role: 'doctor',
        specialty: 'Dentist',
        qualifications: ['BDS', 'MDS'],
        experience: 15,
        hospital: 'Smile Care',
        consultationFee: 1200,
        rating: 4.9,
        reviewsCount: 210,
        location: {
          address: 'Whitefield, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka'
        },
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@mediconnect.com',
        phone: '+919876543213',
        password: 'password123',
        role: 'doctor',
        specialty: 'Cardiologist',
        qualifications: ['MBBS', 'MD', 'DM Cardiology'],
        experience: 20,
        hospital: 'Heart Institute',
        consultationFee: 2500,
        rating: 5.0,
        reviewsCount: 305,
        location: {
          address: 'Hebbal, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka'
        },
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Dr. Emily Chen',
        email: 'emily.chen@mediconnect.com',
        phone: '+919876543214',
        password: 'password123',
        role: 'doctor',
        specialty: 'Neurologist',
        qualifications: ['MBBS', 'MD', 'DM Neurology'],
        experience: 14,
        hospital: 'Neuro Care',
        consultationFee: 2000,
        rating: 4.8,
        reviewsCount: 150,
        location: {
          address: 'Jayanagar, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka'
        },
        isVerified: true,
        profileImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=200&auto=format&fit=crop'
      }
    ]);
    console.log(`✅ Created ${doctors.length} doctors`);
    
    console.log('💊 Creating medicines...');
    const medicines = await Medicine.insertMany([
      { name: 'Dolo 650mg', type: 'Tablet', price: 30, originalPrice: 40, discount: 25, category: 'Tablets', manufacturer: 'Micro Labs Ltd', dosage: '650mg', packSize: '15 Tablets', description: 'Used for fever and mild to moderate pain relief.', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200', inStock: true, stock: 500 },
      { name: 'Benadryl Cough Syrup', type: 'Syrup', price: 110, originalPrice: 125, discount: 12, category: 'Syrups', manufacturer: 'Johnson & Johnson', dosage: '150ml', packSize: '1 Bottle', description: 'Relieves cough, congestion, and throat irritation.', image: 'https://images.unsplash.com/photo-1603555501671-3f938d01f92e?auto=format&fit=crop&q=80&w=200', inStock: true, stock: 200 },
      { name: 'Volini Gel', type: 'Ointment', price: 145, originalPrice: 160, discount: 9, category: 'Creams & Ointments', manufacturer: 'Sun Pharma', dosage: '30g', packSize: '1 Tube', description: 'Pain relief gel for joint, back, neck, and shoulder pain.', image: 'https://images.unsplash.com/photo-1626968037373-c4eb9d042299?auto=format&fit=crop&q=80&w=200', inStock: true, stock: 150 },
      { name: 'Seven Seas Cod Liver Oil', type: 'Capsule', price: 320, originalPrice: 400, discount: 20, category: 'Supplements', manufacturer: 'Merck', dosage: '300mg', packSize: '100 Capsules', description: 'Rich source of Omega-3 and Vitamin D for heart and immunity.', image: 'https://images.unsplash.com/photo-1550572017-ed108bc2773d?auto=format&fit=crop&q=80&w=200', inStock: true, stock: 100 }
    ]);
    console.log(`✅ Created ${medicines.length} medicines`);
    
    console.log('🧪 Creating lab tests...');
    const labTests = await LabTest.insertMany([
      { 
        title: 'Apollo Superior Full Body Checkup', 
        type: 'Package', 
        testCount: 89, 
        tags: ['Includes FREE Vitamin D Test'], 
        price: 3249, 
        originalPrice: 9283, 
        discount: 65, 
        tat: '24 hrs', 
        category: 'Full Body', 
        image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=200',
        description: 'A comprehensive health checkup designed to screen for common health conditions.',
        testsIncluded: ['Complete Blood Count (CBC)', 'Diabetes Screen (HbA1c, Fasting Glucose)', 'Liver Function Test', 'Lipid Profile', 'Thyroid Profile'],
        preparation: ['Fasting of 10-12 hours is strictly required.', 'Drink water to stay hydrated.'],
        location: 'Apollo Diagnostics, Indiranagar, Bangalore',
        inStock: true
      },
      { 
        title: 'Thyroid Profile (T3, T4, TSH)', 
        type: 'Test', 
        testCount: 3, 
        price: 499, 
        originalPrice: 1000, 
        discount: 50, 
        tat: '6 hrs', 
        category: 'Thyroid', 
        image: 'https://images.unsplash.com/photo-1606618779553-9562433f014e?auto=format&fit=crop&q=80&w=200',
        description: 'Measures the level of thyroid hormones in your blood.',
        testsIncluded: ['Triiodothyronine (T3)', 'Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
        preparation: ['No fasting required.'],
        location: 'Thyrocare, Jayanagar, Bangalore',
        inStock: true
      },
      { 
        title: 'CBC Test (Complete Blood Count)', 
        type: 'Test', 
        testCount: 30, 
        price: 419, 
        originalPrice: 1047, 
        discount: 60, 
        tat: '4 hrs', 
        category: 'Blood Studies', 
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=200',
        description: 'Evaluates overall health and detects a wide range of disorders.',
        testsIncluded: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count'],
        preparation: ['No fasting required.'],
        location: 'Dr. Lal PathLabs, MG Road, Bangalore',
        inStock: true
      }
    ]);
    console.log(`✅ Created ${labTests.length} lab tests`);
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
