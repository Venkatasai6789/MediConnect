import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('');
    console.error('🔧 TO FIX THIS:');
    console.error('   1. Go to https://cloud.mongodb.com/');
    console.error('   2. Select your cluster > Network Access');
    console.error('   3. Click "Add IP Address"');
    console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
    console.error('   5. Save and wait 1-2 minutes');
    console.error('');
    console.error('⚠️  Server will continue without database - routes may not work properly');
    console.error('');
    
    return null;
  }
};

export default connectDB;
