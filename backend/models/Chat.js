import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  participantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Chat', chatSchema);
