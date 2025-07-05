import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI, usersAPI } from '../services/api';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const { socket, sendMessage: socketSendMessage, sendTyping, sendStopTyping, typingUsers } = useChat();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
      fetchUsers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    filterUsers();
  }, [users, searchUser]);

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('receive_message', (data) => {
        if (selectedConversation && data.conversationId === selectedConversation._id) {
          setMessages(prev => [...prev, data.message]);
        }
        // Refresh conversations to show latest message
        fetchConversations();
      });

      socket.on('message_sent', (data) => {
        // Message was sent successfully, refresh messages
        if (selectedConversation && data.conversationId === selectedConversation._id) {
          fetchMessages(selectedConversation._id);
        }
      });

      return () => {
        socket.off('receive_message');
        socket.off('message_sent');
      };
    }
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      // Filter out current user and users with different roles (optional)
      const filteredUsers = response.data.filter(u => 
        u._id !== user._id && 
        (user.role === 'farmer' ? u.role === 'buyer' : u.role === 'farmer')
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterUsers = () => {
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messagesAPI.getConversation(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const startConversation = async (receiverId) => {
    try {
      await messagesAPI.startConversation(receiverId);
      setShowNewChat(false);
      setSearchUser('');
      fetchConversations(); // Refresh conversations
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleTyping = () => {
    if (!isTyping && selectedConversation) {
      setIsTyping(true);
      sendTyping(selectedConversation.participant._id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedConversation) {
        sendStopTyping(selectedConversation.participant._id);
      }
    }, 1000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        content: newMessage,
        receiverId: selectedConversation.participant._id,
        conversationId: selectedConversation._id
      };

      // Send via Socket.IO for real-time delivery
      socketSendMessage(messageData);
      
      // Also send via API to save to database
      await messagesAPI.create(messageData);
      
      setNewMessage('');
      
      // Stop typing indicator
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (selectedConversation) {
        sendStopTyping(selectedConversation.participant._id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">Please login to access the chat feature</p>
            <a
              href="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  title="Start New Conversation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {showNewChat ? (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Start New Chat</h3>
                    <button
                      onClick={() => setShowNewChat(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                  />
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredUsers.map(user => (
                      <div
                        key={user._id}
                        onClick={() => startConversation(user._id)}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && searchUser && (
                      <p className="text-sm text-gray-500 text-center py-4">No users found</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-600">Loading conversations...</span>
                      </div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">💬</span>
                      </div>
                      <p className="text-gray-500 text-sm">No conversations yet</p>
                      <p className="text-gray-400 text-xs mt-1">Click the + button to start chatting</p>
                    </div>
                  ) : (
                    <div className="overflow-y-auto h-full">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation._id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                            selectedConversation?._id === conversation._id ? 'bg-green-50 border-green-200' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {conversation.participant.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {conversation.participant.name}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {conversation.participant.role}
                              </p>
                              {conversation.lastMessage && (
                                <p className="text-xs text-gray-600 truncate mt-1">
                                  {conversation.lastMessage.content}
                                </p>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <div className="text-xs text-gray-400">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedConversation.participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {selectedConversation.participant.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedConversation.participant.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">💬</span>
                        </div>
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const isOwnMessage = message.sender._id === user._id;
                          const showDate = index === 0 || 
                            formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                          return (
                            <div key={message._id}>
                              {showDate && (
                                <div className="text-center mb-4">
                                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    {formatDate(message.createdAt)}
                                  </span>
                                </div>
                              )}
                              <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isOwnMessage 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-white text-gray-800 border border-gray-200'
                                }`}>
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    isOwnMessage ? 'text-green-100' : 'text-gray-500'
                                  }`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {typingUsers[selectedConversation?.participant._id] && (
                          <div className="flex items-center space-x-2 text-gray-500 text-sm italic p-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span>{selectedConversation.participant.name} is typing...</span>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={sendMessage} className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {sending ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </div>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 