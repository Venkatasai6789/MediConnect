# MediConnect Backend

Complete backend API for MediConnect healthcare platform with authentication, appointments, consultations, pharmacy, lab tests, and real-time chat.

## Features

- 🔐 JWT Authentication with OTP verification
- 👥 Role-based access control (Patient, Doctor, Admin)
- 📅 Appointment booking and management
- 💊 Medicine catalog and ordering
- 🧪 Lab test booking
- 💬 Real-time chat (Socket.IO)
- 💳 Payment processing
- 📄 Health report management
- 📧 Email notifications

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- Socket.IO for real-time features
- JWT for authentication
- Multer for file uploads
- Nodemailer for emails

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB URI
- JWT Secret
- Email credentials (Gmail)
- Stripe/Payment gateway keys

4. Create uploads directory:
```bash
mkdir -p uploads/health-reports
```

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/phone-login` - Login with phone

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Doctors
- `GET /api/doctors` - Get all doctors (with filters)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/my/patients` - Get doctor's patients
- `GET /api/doctors/my/stats` - Get doctor stats
- `PUT /api/doctors/profile` - Update doctor profile

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update status
- `DELETE /api/appointments/:id` - Cancel appointment

### Patients
- `GET /api/patients/profile` - Get patient profile
- `GET /api/patients/stats` - Get patient stats
- `GET /api/patients/history` - Get appointment history

### Medicines
- `GET /api/medicines` - Get all medicines (with filters)
- `GET /api/medicines/:id` - Get medicine by ID
- `GET /api/medicines/meta/categories` - Get categories

### Lab Tests
- `GET /api/lab-tests` - Get all lab tests (with filters)
- `GET /api/lab-tests/:id` - Get lab test by ID
- `GET /api/lab-tests/meta/categories` - Get categories

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/:chatId` - Get chat messages
- `POST /api/chat/create` - Create new chat
- `POST /api/chat/send` - Send message
- `PUT /api/chat/:chatId/mark-read` - Mark as read

### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment details

### Health Reports
- `POST /api/health-reports` - Upload report
- `GET /api/health-reports` - Get user reports
- `GET /api/health-reports/:id` - Get report by ID
- `DELETE /api/health-reports/:id` - Delete report

## Database Setup

Make sure MongoDB is running locally on port 27017, or use MongoDB Atlas connection string.

## Socket.IO Events

### Client → Server
- `join-chat` - Join a chat room
- `leave-chat` - Leave a chat room
- `send-message` - Send a message
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server → Client
- `receive-message` - Receive new message
- `user-typing` - Another user is typing
- `user-stopped-typing` - User stopped typing

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
