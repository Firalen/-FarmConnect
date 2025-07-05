import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to Socket.IO server
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        // Join user's personal room
        newSocket.emit('join', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
      });

      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.senderId]: true
        }));
      });

      newSocket.on('user_stop_typing', (data) => {
        setTypingUsers(prev => {
          const newState = { ...prev };
          delete newState[data.senderId];
          return newState;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit('send_message', messageData);
    }
  };

  const sendTyping = (receiverId) => {
    if (socket) {
      socket.emit('typing', { receiverId, senderId: user._id });
    }
  };

  const sendStopTyping = (receiverId) => {
    if (socket) {
      socket.emit('stop_typing', { receiverId, senderId: user._id });
    }
  };

  const value = {
    socket,
    sendMessage,
    sendTyping,
    sendStopTyping,
    onlineUsers,
    typingUsers,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 