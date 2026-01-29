import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/:conversationId', asyncHandler(async (req, res) => {
  res.json({ message: 'Get chat messages' });
}));

router.post('/:conversationId', asyncHandler(async (req, res) => {
  res.json({ message: 'Send message' });
}));

export default router;
