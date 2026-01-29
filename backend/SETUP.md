# Backend Setup Guide

## Prerequisites
- Node.js >= 16
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to backend directory:
```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mediconnect
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediconnect

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=30d

# Email (for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3001

# File Upload
MAX_FILE_SIZE=10485760

# Payment Gateway (Optional)
STRIPE_API_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Socket.io
SOCKET_URL=http://localhost:3001
```

## Running the Backend

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## Database Seeding

Seed the database with sample data:

```bash
npm run seed
```

This will create:
- Sample doctors
- Sample medicines
- Sample lab tests
- Sample patients (optional)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/phone-login` - Login with phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor profile
- `GET /api/doctors/:id/appointments` - Get doctor appointments
- `GET /api/doctors/:id/patients` - Get doctor's patients

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment

### Patients
- `GET /api/patients/profile` - Get patient profile
- `GET /api/patients/stats` - Get patient statistics
- `GET /api/patients/history` - Get appointment history

### Medicines
- `GET /api/medicines` - Get medicines with filters
- `GET /api/medicines/:id` - Get medicine details
- `GET /api/medicines/meta/categories` - Get medicine categories

### Lab Tests
- `GET /api/lab-tests` - Get lab tests with filters
- `GET /api/lab-tests/:id` - Get lab test details
- `GET /api/lab-tests/meta/categories` - Get lab test categories

### Health Reports
- `POST /api/health-reports` - Upload health report
- `GET /api/health-reports` - Get user's health reports
- `GET /api/health-reports/:id` - Get health report details
- `DELETE /api/health-reports/:id` - Delete health report

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat?conversationId=X` - Get chat messages
- `POST /api/chat/start` - Start conversation with doctor
- `POST /api/chat/send` - Send message

### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id` - Get payment details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Testing with Curl

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "patient"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For local MongoDB: `mongodb://localhost:27017/mediconnect`
- For MongoDB Atlas: Use full connection string with credentials

### Email Not Working
- Enable "Less secure app access" in Gmail settings
- Use App Password instead of regular password
- Check email credentials in `.env`

### CORS Error
- Ensure `FRONTEND_URL` is set correctly in `.env`
- Check that frontend is running on the specified port

## Architecture

```
backend/
├── config/       # Database and configuration files
├── models/       # MongoDB schemas
├── routes/       # API route handlers
├── middleware/   # Authentication, error handling
├── utils/        # Utility functions (email, etc)
├── socket/       # WebSocket handlers
├── scripts/      # Database seeding
├── server.js     # Main application entry
└── package.json  # Dependencies
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time messaging
- **Multer** - File uploads
- **Nodemailer** - Email service
- **Stripe** - Payment processing

## Support

For issues or questions, refer to the documentation or create an issue in the repository.
