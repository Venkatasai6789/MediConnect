import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all medicines' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Get medicine by ID' });
}));

export default router;
