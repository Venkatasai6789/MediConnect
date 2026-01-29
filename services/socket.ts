import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL)?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a chat room
  joinChat(chatId: string) {
    this.socket?.emit('join-chat', chatId);
  }

  // Leave a chat room
  leaveChat(chatId: string) {
    this.socket?.emit('leave-chat', chatId);
  }

  // Send a message
  sendMessage(chatId: string, message: any) {
    this.socket?.emit('send-message', { chatId, message });
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (message: any) => void) {
    this.socket?.on('receive-message', callback);
  }

  // Typing indicators
  startTyping(chatId: string, userName: string) {
    this.socket?.emit('typing', { chatId, userName });
  }

  stopTyping(chatId: string) {
    this.socket?.emit('stop-typing', { chatId });
  }

  onUserTyping(callback: (data: { userName: string }) => void) {
    this.socket?.on('user-typing', callback);
  }

  onUserStoppedTyping(callback: () => void) {
    this.socket?.on('user-stopped-typing', callback);
  }

  // Clean up listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();
