import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Get all health reports' });
}));

router.post('/', asyncHandler(async (req, res) => {
  res.json({ message: 'Create health report' });
}));

export default router;
