import { io } from 'socket.io-client';
import { receiveAiResponse, setIsGenerating } from '../store/slices/chatSlice';

let socket = null;

export const initSocket = (dispatch, onAiError) => {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  socket = io(backendUrl, {
    withCredentials: true,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Connected with ID:', socket.id);
  });

  socket.on('ai-response', (data) => {
    console.log('[Socket.IO] Received ai-response:', data);
    
    if (data?.chat && data?.content) {
      dispatch(receiveAiResponse({ chatId: data.chat, content: data.content }));
    } 
  });

  socket.on('ai-error', (data) => {
    console.error('[Socket.IO] AI error:', data);
    dispatch(setIsGenerating({ chatId: data.chat , value: false}));
        if (onAiError) {
      onAiError(
        data?.message || 'AI service is temporarily unavailable.'
      );
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Disconnected:', reason);
  });

  return socket;
};

export const sendAiMessage = ({ chat, content }) => {
  if (!socket?.connected) {
    console.error('[Socket.IO] Cannot send message - socket not connected');
    return false;
  }

  socket.emit('ai-message', { chat, content });
  return true;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;