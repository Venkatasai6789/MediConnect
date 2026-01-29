import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all appointments' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create appointment' });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Update appointment' });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Delete appointment' });
}));

export default router;
