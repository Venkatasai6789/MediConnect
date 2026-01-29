import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all doctors' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Get doctor by ID' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create doctor' });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Update doctor' });
}));

export default router;
