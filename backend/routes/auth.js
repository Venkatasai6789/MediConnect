import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  // Auth registration logic
  res.json({ message: 'Register route' });
}));

router.post('/login', asyncHandler(async (req, res) => {
  // Auth login logic
  res.json({ message: 'Login route' });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  res.json({ message: 'Logout successful' });
}));

export default router;
