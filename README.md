# MediConnect - Healthcare Telemedicine Platform

A comprehensive full-stack healthcare telemedicine platform connecting patients with doctors for consultations, health records management, lab tests, and medicine delivery.

## Features

### For Patients
- ✅ User authentication (email, phone, OTP)
- ✅ Browse and book appointments with doctors
- ✅ Video call and in-clinic consultations
- ✅ View prescriptions and health reports
- ✅ Order medicines from pharmacy
- ✅ Book lab tests with home collection
- ✅ Real-time chat with doctors
- ✅ Manage appointment history
- ✅ View consultation history and reports

### For Doctors
- ✅ User authentication and profile management
- ✅ Manage availability and consultation slots
- ✅ View upcoming appointments
- ✅ Conduct video/in-clinic consultations
- ✅ Issue prescriptions and health reports
- ✅ View patient medical history
- ✅ Real-time chat with patients
- ✅ Dashboard with statistics

### General Features
- ✅ Role-based access control (Patient/Doctor/Admin)
- ✅ Real-time messaging with Socket.io
- ✅ Secure JWT authentication
- ✅ Payment processing integration
- ✅ File uploads (health reports, documents)
- ✅ Responsive UI with Tailwind CSS
- ✅ Complete RESTful API

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons
- React Router
- Socket.io Client

### Backend
- Node.js / Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- Socket.io
- Multer (File uploads)
- Nodemailer (Email service)
- Stripe/Razorpay (Payments)

## Project Structure

```
MediConnect/
├── frontend/
│   ├── components/        # React components
│   ├── services/         # API service, Socket.io
│   ├── utils/            # Authentication utilities
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── config/           # Database configuration
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, error handling
│   ├── utils/            # Email, helpers
│   ├── socket/           # WebSocket handlers
│   ├── scripts/          # Database seeding
│   ├── server.js         # Express server
│   ├── package.json
│   ├── SETUP.md          # Backend setup guide
│   └── .env.example      # Environment template
│
└── README.md
```

## Installation & Setup

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env (optional, for API URL override)
VITE_API_URL=http://localhost:5000/api

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend runs on `http://localhost:3001`

### Backend Setup

See [backend/SETUP.md](backend/SETUP.md) for detailed setup instructions.

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# See .env.example for template

# Run development server
npm run dev

# Seed database with sample data
npm run seed

# Start production server
npm start
```

The backend runs on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /auth/register       - Register new user
POST   /auth/login          - Login with email/password
POST   /auth/phone-login    - Login with phone
POST   /auth/verify-otp     - Verify OTP
POST   /auth/resend-otp     - Resend OTP
```

### Doctor Endpoints
```
GET    /doctors             - Get all doctors with filters
GET    /doctors/:id         - Get doctor details
PUT    /doctors/:id         - Update doctor profile
GET    /doctors/:id/appointments - Get doctor's appointments
GET    /doctors/:id/patients     - Get doctor's patients
```

### Appointment Endpoints
```
POST   /appointments        - Book new appointment
GET    /appointments/my-appointments - Get user's appointments
GET    /appointments/:id    - Get appointment details
PUT    /appointments/:id/status - Update appointment status
DELETE /appointments/:id    - Cancel appointment
```

### Patient Endpoints
```
GET    /patients/profile    - Get patient profile
GET    /patients/stats      - Get patient statistics
GET    /patients/history    - Get appointment history
```

### Medicine Endpoints
```
GET    /medicines           - Get medicines with filters
GET    /medicines/:id       - Get medicine details
GET    /medicines/meta/categories - Get medicine categories
```

### Lab Test Endpoints
```
GET    /lab-tests           - Get lab tests with filters
GET    /lab-tests/:id       - Get lab test details
GET    /lab-tests/meta/categories - Get lab test categories
```

### Chat Endpoints
```
GET    /chat/conversations  - Get user's conversations
GET    /chat?conversationId=X - Get chat messages
POST   /chat/start          - Start conversation
POST   /chat/send           - Send message
```

### Payment Endpoints
```
POST   /payments/create     - Create payment
GET    /payments/history    - Get payment history
GET    /payments/:id        - Get payment details
```

### Health Report Endpoints
```
POST   /health-reports      - Upload health report
GET    /health-reports      - Get user's health reports
GET    /health-reports/:id  - Get health report details
DELETE /health-reports/:id  - Delete health report
```

### User Endpoints
```
GET    /users/profile       - Get user profile
PUT    /users/profile       - Update user profile
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication.

### How it works:
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage as `auth_token`
4. Token included in Authorization header for API requests
5. Server validates token on protected routes

### Protected Routes:
- Patient Dashboard
- Doctor Dashboard
- Appointment Booking
- Chat
- Health Reports
- Payments

## Database Schema

### User
- name, email, phone, password
- role (patient/doctor/admin)
- profileImage, isVerified
- OTP for verification
- Doctor/Patient specific fields

### Doctor
- userId (reference to User)
- specialties, license, qualifications
- yearsOfExperience, hospital
- consultationFee, rating
- availability slots
- location coordinates

### Appointment
- patientId, doctorId
- appointmentDate, appointmentTime
- consultationType (video/clinic)
- reason, symptoms
- status, notes
- prescription, healthReport references

### Prescription
- appointmentId, patientId, doctorId
- medicines array with dosage, frequency, duration
- diagnosis, notes
- issuedDate, expiryDate, status

### Chat
- conversationId, senderId, receiverId
- message, messageType (text/image/file)
- attachmentUrl, isRead
- timestamps

### Payment
- userId, paymentType
- amount, currency, paymentMethod
- transactionId, paymentGateway
- status (Pending/Completed/Failed/Refunded)
- refund details

### HealthReport
- patientId, doctorId, appointmentId
- reportType, title, description, findings
- vitals, labResults
- status, reviewedBy, reviewedDate

### LabTest
- patientId, testName, category
- cost, status, scheduledDate
- reportUrl, results
- labCenter details, home collection available

### Medicine
- name, composition, manufacturer
- category, dosage, price
- stock, requiresPrescription
- sideEffects, precautions, interactions
- rating, reviewsCount

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/mediconnect
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
FRONTEND_URL=http://localhost:3001
STRIPE_API_KEY=your_stripe_key
```

See [backend/.env.example](backend/.env.example) for complete template.

## Running the Application

### Development Mode (Both Frontend & Backend)

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Testing the Application

1. **Register as Patient:**
   - Go to signup modal
   - Enter email, phone, password
   - Verify OTP (for development, check console)
   - Login

2. **Browse Doctors:**
   - View doctors list with filters
   - Click to see doctor details
   - Book appointment

3. **Chat with Doctor:**
   - Open chat from appointment details
   - Send messages in real-time

4. **View Health Records:**
   - Upload health reports
   - View past consultations
   - Download reports

## Database Seeding

To populate database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- 10 sample doctors with various specialties
- 50+ medicines in different categories
- 20+ lab tests
- Sample patients (optional)

## Known Limitations & Future Enhancements

### Current Limitations
- Payment integration with Stripe is stubbed (development mode)
- SMS for phone OTP requires Twilio setup
- Video calls require real Jitsi/Zoom integration

### Future Enhancements
- [ ] Integrate Stripe/Razorpay for real payments
- [ ] Add Twilio for SMS OTP
- [ ] Integrate Jitsi Meet for video calls
- [ ] Add admin dashboard
- [ ] Prescription medication ordering
- [ ] Insurance integration
- [ ] Advanced analytics and reports
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] AI-powered symptom checker

## Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables on hosting platform
# Ensure MongoDB is accessible
# Run: npm start
```

## Troubleshooting

### Port Already in Use
```bash
# Frontend (change port in vite.config.ts)
# Backend: Kill process on port 5000
# macOS/Linux: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Windows: netstat -ano | findstr :5000 && taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify credentials for MongoDB Atlas

### CORS Errors
- Ensure FRONTEND_URL in backend .env matches frontend URL
- Check browser console for exact error

### Email/OTP Not Working
- Enable "Less secure apps" in Gmail
- Use App-specific password for Gmail
- Check email credentials in .env

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mediconnect.com or create an issue in the repository.

## Authors

- **Development Team** - Full-stack development
- **Contributors** - Community contributions

## Acknowledgments

- Tailwind CSS for styling
- Express.js for backend framework
- MongoDB for database
- React for UI framework
- Socket.io for real-time features

---

**MediConnect** - Connecting Healthcare, One Consultation at a Time 🏥
