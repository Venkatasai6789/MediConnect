export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    
    // Join a room (chat room)
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat: ${chatId}`);
    });
    
    // Leave a room
    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat: ${chatId}`);
    });
    
    // Send message
    socket.on('send-message', (data) => {
      const { chatId, message } = data;
      // Broadcast to all users in the chat room except sender
      socket.to(chatId).emit('receive-message', message);
    });
    
    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId, userName } = data;
      socket.to(chatId).emit('user-typing', { userName });
    });
    
    socket.on('stop-typing', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user-stopped-typing');
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
