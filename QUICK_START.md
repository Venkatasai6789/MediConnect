# Quick Start Guide

## Prerequisites
- Node.js >= 16
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## Installation & Running (5 minutes)

### Step 1: Frontend Setup
```bash
# From root directory
npm install
npm run dev
```
Frontend opens on: **http://localhost:3001**

### Step 2: Backend Setup
```bash
# In new terminal, from root directory
cd backend
npm install
```

### Step 3: Configure Backend
Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/mediconnect
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
FRONTEND_URL=http://localhost:3001
```

### Step 4: Run Backend
```bash
# From backend directory
npm run dev
```
Backend runs on: **http://localhost:5000**

### Step 5: (Optional) Seed Database
```bash
# From backend directory, in new terminal
npm run seed
```
This populates the database with sample doctors, medicines, and lab tests.

## Default Test Accounts

### After running `npm run seed`:

**Doctor Account:**
- Email: doctor1@example.com
- Password: password123
- Specialty: General Physician

**Patient Account:**
- Email: patient1@example.com
- Password: password123
- Already registered and verified

## Testing the App

### As Patient:
1. Go to http://localhost:3001
2. Click "Signup" → Register or login with test account
3. Browse doctors → Book appointment
4. View chat → Message with doctor
5. Upload health reports → View history

### As Doctor:
1. Login with doctor account
2. View upcoming appointments
3. Chat with patients
4. Update appointment status
5. View patient list

## Common Issues & Solutions

### Port 3001 Already in Use
Edit `vite.config.ts`:
```typescript
server: {
  port: 3002, // Change this
}
```

### Port 5000 Already in Use
Change in `backend/.env`:
```env
PORT=5001
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
# Local: mongod
# Atlas: Check connection string in .env
```

### Email/OTP Not Working
- Use Gmail with App Password
- Enable "Less secure apps" in Google account
- Check `.env` credentials

## Project Structure at a Glance

```
Root/
├── src/                    # Frontend React code
├── backend/                # Backend Express server
│   ├── models/            # MongoDB schemas (10 models)
│   ├── routes/            # API endpoints (43 routes)
│   ├── SETUP.md          # Detailed backend guide
│   └── .env.example      # Environment template
├── package.json           # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── README.md             # Full documentation
├── PROJECT_SUMMARY.md    # What was built
└── QUICK_START.md        # This file
```

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, MongoDB, JWT
- **Real-time**: Socket.io for chat
- **Payments**: Stripe ready (stubbed in dev)
- **Files**: Multer for uploads

## API Testing

### Test Doctor List
```bash
curl http://localhost:5000/api/doctors
```

### Test Medicine List
```bash
curl http://localhost:5000/api/medicines
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"9876543210",
    "password":"pass123",
    "role":"patient"
  }'
```

## Features You Can Test

✅ **User Authentication**
- Register with email/phone
- OTP verification
- Login
- Logout

✅ **Doctor Booking**
- Browse doctors by specialty
- View doctor profiles
- Book appointments

✅ **Real-time Chat**
- Message doctors
- Send files
- See online status

✅ **Health Records**
- Upload reports
- View health history
- Download documents

✅ **Medicines**
- Search medicines
- View details
- Check stock

✅ **Lab Tests**
- Browse tests
- Check requirements
- Book tests

## Next Steps

### Development
1. Read [README.md](README.md) for full documentation
2. Check [backend/SETUP.md](backend/SETUP.md) for backend details
3. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for what was built

### Customization
- Modify colors in Tailwind config
- Add your own doctors/medicines
- Customize email templates
- Add your Stripe keys for payments

### Deployment
- Frontend: Deploy to Vercel/Netlify
- Backend: Deploy to Heroku/Railway
- Database: Use MongoDB Atlas

## Getting Help

### Check Logs
- Frontend: Open browser DevTools (F12)
- Backend: Check terminal output

### Debug API
- Use Postman or Insomnia
- Base URL: http://localhost:5000/api
- Check network tab in DevTools

### Common Errors
| Error | Solution |
|-------|----------|
| "Cannot GET /api/doctors" | Backend not running |
| "Port 3001 in use" | Change Vite port |
| "MongoDB connection failed" | Start MongoDB or fix URI |
| "CORS error" | Check FRONTEND_URL in .env |

## File Sizes (for reference)

```
Frontend:
├── services/api.ts        ~5 KB  (API client)
├── components/            ~500 KB (React components)
└── App.tsx               ~15 KB  (Main app)

Backend:
├── routes/               ~30 KB  (10 route files)
├── models/              ~20 KB  (10 model files)
├── middleware/          ~2 KB
└── server.js            ~2 KB
```

## Performance Tips

1. **Frontend**: npm run build for optimized bundle
2. **Backend**: Use MongoDB indexes for faster queries
3. **Database**: Use MongoDB Atlas for better performance
4. **Caching**: Implement Redis for frequent requests
5. **CDN**: Use Cloudflare for static assets

## Security Reminders

- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Never commit .env files
- ⚠️ Keep dependencies updated
- ⚠️ Validate all user inputs
- ⚠️ Use strong passwords

## Monitoring & Logs

```bash
# View backend logs
# Terminal will show all API requests and errors

# Frontend console
# Open DevTools → Console tab for any errors
```

## Production Checklist

- [ ] Set JWT_SECRET to random string
- [ ] Configure real email service
- [ ] Add Stripe API keys
- [ ] Setup MongoDB Atlas
- [ ] Configure CORS for production URL
- [ ] Enable HTTPS
- [ ] Setup CDN for static files
- [ ] Configure backups
- [ ] Monitor error logs
- [ ] Setup monitoring/alerts

---

**You're all set! 🚀**

Start at **http://localhost:3001** and begin exploring MediConnect!

For issues: Check the logs, verify MongoDB is running, and ensure all ports are available.
