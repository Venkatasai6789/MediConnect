import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
console.log('\n⏳ Attempting to connect...\n');

try {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  
  console.log('✅ SUCCESS! MongoDB Connected');
  console.log('✅ Host:', conn.connection.host);
  console.log('✅ Database:', conn.connection.name);
  console.log('✅ Ready State:', conn.connection.readyState);
  
  await mongoose.connection.close();
  console.log('\n✅ Connection test completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ FAILED! MongoDB Connection Error');
  console.error('Error:', error.message);
  console.error('\n🔧 TROUBLESHOOTING:');
  
  if (error.message.includes('IP') || error.message.includes('whitelist')) {
    console.error('   → Your IP address is not whitelisted');
    console.error('   → Go to: https://cloud.mongodb.com/');
    console.error('   → Navigate to: Network Access');
    console.error('   → Add IP: 0.0.0.0/0 (allow all) or your specific IP');
  } else if (error.message.includes('authentication')) {
    console.error('   → Check your username/password in .env file');
  } else if (error.message.includes('ENOTFOUND')) {
    console.error('   → Check your MongoDB URI in .env file');
  }
  
  process.exit(1);
}
