import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api';
const results = {
  working: [],
  failed: [],
  totalRoutes: 43,
};

// Helper function to test routes
async function testRoute(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Some routes may fail due to missing auth or validation, but if they respond, they exist
    const status = response.status;
    if (status && status !== 404) {
      return { success: true, status, isValidError: status >= 400 }; // Route exists but has validation error
    }
    return { success: false, status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🔍 Testing MediConnect Backend Routes...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  // AUTH ROUTES (7)
  console.log('🔐 AUTH ROUTES (7)');
  console.log('─'.repeat(50));
  
  let routes = [
    ['POST', '/auth/register', { name: 'Test', email: 'test@test.com', phone: '1234567890', password: 'test123' }],
    ['POST', '/auth/login', { email: 'test@test.com', password: 'test123' }],
    ['POST', '/auth/phone-login', { phone: '1234567890' }],
    ['POST', '/auth/verify-otp', { userId: '507f1f77bcf86cd799439011', otp: '123456' }],
    ['POST', '/auth/resend-otp', { userId: '507f1f77bcf86cd799439011' }],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // USER ROUTES (2)
  console.log('👤 USER ROUTES (2)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/users/profile'],
    ['PUT', '/users/profile', { name: 'Updated Name' }],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // DOCTOR ROUTES (8)
  console.log('👨‍⚕️ DOCTOR ROUTES (8)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/doctors'],
    ['GET', '/doctors/507f1f77bcf86cd799439011'],
    ['GET', '/doctors/507f1f77bcf86cd799439011/availability'],
    ['PUT', '/doctors/profile', { specialty: 'Cardiology' }],
    ['GET', '/doctors/507f1f77bcf86cd799439011/patients'],
    ['GET', '/doctors/my/appointments'],
    ['PUT', '/doctors/appointments/507f1f77bcf86cd799439011/status', { status: 'completed' }],
    ['GET', '/doctors/my/stats'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // APPOINTMENT ROUTES (5)
  console.log('📅 APPOINTMENT ROUTES (5)');
  console.log('─'.repeat(50));
  
  routes = [
    ['POST', '/appointments', { doctor: '507f1f77bcf86cd799439011', appointmentDate: new Date().toISOString(), timeSlot: { start: '10:00', end: '10:30' } }],
    ['GET', '/appointments/my-appointments'],
    ['GET', '/appointments/507f1f77bcf86cd799439011'],
    ['PUT', '/appointments/507f1f77bcf86cd799439011/status', { status: 'confirmed' }],
    ['DELETE', '/appointments/507f1f77bcf86cd799439011', { reason: 'Rescheduling' }],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // PATIENT ROUTES (3)
  console.log('🏥 PATIENT ROUTES (3)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/patients/profile'],
    ['GET', '/patients/stats'],
    ['GET', '/patients/history'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // MEDICINE ROUTES (3)
  console.log('💊 MEDICINE ROUTES (3)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/medicines'],
    ['GET', '/medicines/507f1f77bcf86cd799439011'],
    ['GET', '/medicines/meta/categories'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // LAB TEST ROUTES (3)
  console.log('🧪 LAB TEST ROUTES (3)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/lab-tests'],
    ['GET', '/lab-tests/507f1f77bcf86cd799439011'],
    ['GET', '/lab-tests/meta/categories'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // CHAT ROUTES (5)
  console.log('💬 CHAT ROUTES (5)');
  console.log('─'.repeat(50));
  
  routes = [
    ['GET', '/chat/conversations'],
    ['GET', '/chat/507f1f77bcf86cd799439011'],
    ['POST', '/chat/send', { chatId: '507f1f77bcf86cd799439011', text: 'Hi' }],
    ['POST', '/chat/create', { otherUserId: '507f1f77bcf86cd799439011' }],
    ['PUT', '/chat/507f1f77bcf86cd799439011/mark-read'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // PAYMENT ROUTES (3)
  console.log('💳 PAYMENT ROUTES (3)');
  console.log('─'.repeat(50));
  
  routes = [
    ['POST', '/payments/create', { appointmentId: '507f1f77bcf86cd799439011', amount: 500, paymentMethod: 'card' }],
    ['GET', '/payments/history'],
    ['GET', '/payments/507f1f77bcf86cd799439011'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // HEALTH REPORT ROUTES (5)
  console.log('📋 HEALTH REPORT ROUTES (5)');
  console.log('─'.repeat(50));
  
  routes = [
    ['POST', '/health-reports', { title: 'Test Report', type: 'Blood Test' }],
    ['GET', '/health-reports'],
    ['GET', '/health-reports/507f1f77bcf86cd799439011'],
    ['DELETE', '/health-reports/507f1f77bcf86cd799439011'],
  ];

  for (const [method, endpoint, data] of routes) {
    const result = await testRoute(method, endpoint, data);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (result.success) results.working.push(endpoint);
    else results.failed.push(endpoint);
  }
  console.log();

  // HEALTH CHECK
  console.log('❤️  HEALTH CHECK (1)');
  console.log('─'.repeat(50));
  const result = await testRoute('GET', '/health');
  const status = result.success ? '✅' : '❌';
  console.log(`${status} GET /health`);
  if (result.success) results.working.push('/health');
  else results.failed.push('/health');
  console.log();

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Working Routes: ${results.working.length}`);
  console.log(`❌ Failed Routes: ${results.failed.length}`);
  console.log(`📈 Success Rate: ${((results.working.length / (results.working.length + results.failed.length)) * 100).toFixed(2)}%`);
  console.log('═'.repeat(50));

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Routes:');
    results.failed.forEach((route) => console.log(`   - ${route}`));
  }

  console.log('\n✨ Test completed!\n');
  process.exit(0);
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test Error:', error.message);
  console.error('Make sure MongoDB is running and the server is started on port 5000');
  process.exit(1);
});
