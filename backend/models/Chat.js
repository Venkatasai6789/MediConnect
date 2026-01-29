import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'prescription', 'report'],
    default: 'text'
  },
  attachmentUrl: String,
  attachmentType: String,
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  relatedDocument: {
    documentType: String,
    documentId: mongoose.Schema.Types.ObjectId
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String
  }],
  deletedAt: Date,
  editedAt: Date,
  editHistory: [{
    content: String,
    editedAt: Date
  }]
}, {
  timestamps: true
});

chatSchema.index({ conversationId: 1, createdAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
