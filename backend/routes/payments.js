import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all payments' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create payment' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Get payment by ID' });
}));

export default router;
