const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Send message (protected)
router.post('/', protect, messageController.sendMessage);
// Get messages between users (protected)
router.get('/:userId', protect, messageController.getMessages);

module.exports = router; 