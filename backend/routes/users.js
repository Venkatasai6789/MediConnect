import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ message: 'Get all users' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Get user by ID' });
}));

router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ message: 'Update user' });
}));

router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  res.json({ message: 'Delete user' });
}));

export default router;
