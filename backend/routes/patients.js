import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all patients' });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  res.json({ message: 'Get patient by ID' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create patient' });
}));

export default router;
