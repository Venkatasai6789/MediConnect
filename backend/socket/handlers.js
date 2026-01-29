export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`📱 New client connected: ${socket.id}`);

    socket.on('join-room', (room) => {
      socket.join(room);
      console.log(`✅ User joined room: ${room}`);
    });

    socket.on('send-message', (data) => {
      io.to(data.room).emit('receive-message', data);
      console.log(`💬 Message sent in ${data.room}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
