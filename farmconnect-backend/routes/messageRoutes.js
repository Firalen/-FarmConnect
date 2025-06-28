const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Conversation routes
router.get('/conversations', protect, messageController.getConversations);
router.get('/conversation/:conversationId', protect, messageController.getConversation);
router.post('/conversation', protect, messageController.startConversation);

// Message routes
router.get('/', protect, messageController.getMessages);
router.get('/:id', protect, messageController.getMessageById);
router.post('/', protect, messageController.sendMessage);
router.put('/:id', protect, messageController.updateMessage);
router.delete('/:id', protect, messageController.deleteMessage);

module.exports = router; 