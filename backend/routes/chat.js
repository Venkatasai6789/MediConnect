import express from 'express';
import { protect } from '../middleware/auth.js';
import Chat from '../models/Chat.js';

const router = express.Router();

// @route   GET /api/chat/conversations
// @desc    Get user's chat conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user.id
    })
      .populate('participants.user', 'name profileImage role')
      .sort('-lastMessage.createdAt');
    
    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/chat/:chatId
// @desc    Get chat messages
// @access  Private
router.get('/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants.user', 'name profileImage role')
      .populate('messages.sender', 'name profileImage');
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Verify user is participant
    const isParticipant = chat.participants.some(
      p => p.user._id.toString() === req.user.id
    );
    
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/chat/send
// @desc    Send a message
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { chatId, text, type, fileUrl, fileName } = req.body;
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    const message = {
      sender: req.user.id,
      text,
      type: type || 'text',
      fileUrl,
      fileName,
      status: 'sent',
      createdAt: new Date()
    };
    
    chat.messages.push(message);
    chat.lastMessage = {
      text: text || 'Sent a file',
      createdAt: new Date()
    };
    
    // Update unread count for other participants
    chat.participants.forEach(p => {
      if (p.user.toString() !== req.user.id) {
        if (p.role === 'patient') {
          chat.unreadCount.patient += 1;
        } else {
          chat.unreadCount.doctor += 1;
        }
      }
    });
    
    await chat.save();
    
    const populatedChat = await Chat.findById(chatId)
      .populate('participants.user', 'name profileImage role')
      .populate('messages.sender', 'name profileImage');
    
    res.json({ success: true, data: populatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/chat/create
// @desc    Create or get existing chat
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { otherUserId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      'participants.user': { $all: [req.user.id, otherUserId] }
    }).populate('participants.user', 'name profileImage role');
    
    if (existingChat) {
      return res.json({ success: true, data: existingChat });
    }
    
    // Create new chat
    const newChat = await Chat.create({
      participants: [
        { user: req.user.id, role: req.user.role },
        { user: otherUserId, role: req.user.role === 'patient' ? 'doctor' : 'patient' }
      ],
      messages: []
    });
    
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants.user', 'name profileImage role');
    
    res.status(201).json({ success: true, data: populatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/chat/:chatId/mark-read
// @desc    Mark messages as read
// @access  Private
router.put('/:chatId/mark-read', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    
    // Reset unread count for current user
    if (req.user.role === 'patient') {
      chat.unreadCount.patient = 0;
    } else {
      chat.unreadCount.doctor = 0;
    }
    
    await chat.save();
    
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
