const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find conversations where user is a participant
    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    })
    .populate('participants', 'name email role')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    // Format conversations to show the other participant
    const formattedConversations = conversations.map(conversation => {
      const otherParticipant = conversation.participants.find(
        participant => participant._id.toString() !== userId.toString()
      );
      
      return {
        _id: conversation._id,
        participant: otherParticipant,
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount.get(userId.toString()) || 0,
        updatedAt: conversation.updatedAt
      };
    });

    res.json(formattedConversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get messages for a specific conversation
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        conversationId, 
        receiver: userId, 
        isRead: false 
      },
      { isRead: true }
    );

    // Update unread count
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 }
    });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ message: err.message });
  }
};

// Start a new conversation
exports.startConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'Cannot start conversation with yourself' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        unreadCount: new Map()
      });
    }

    res.status(201).json(conversation);
  } catch (err) {
    console.error('Error starting conversation:', err);
    res.status(500).json({ message: err.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { content, receiverId, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;
    
    if (conversationId) {
      // Use existing conversation
      conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(senderId)) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // Find or create conversation
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
          unreadCount: new Map()
        });
      }
    }

    // Create message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      conversationId: conversation._id
    });

    // Populate sender and receiver info
    await message.populate('sender', 'name email role');
    await message.populate('receiver', 'name email role');

    // Update conversation
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: message._id,
      $inc: { [`unreadCount.${receiverId}`]: 1 }
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all messages (legacy)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get message by id
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role');
    
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.assign(message, req.body);
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 