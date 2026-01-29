import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all lab tests' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create lab test' });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Update lab test' });
}));

export default router;
