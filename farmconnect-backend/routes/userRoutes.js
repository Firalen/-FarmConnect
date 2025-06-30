const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Register
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Get profile (protected)
router.get('/profile', protect, userController.getProfile);
// Get all users (admin only)
router.get('/', protect, admin, userController.getAllUsers);
// Update user (admin only)
router.put('/:id', protect, admin, userController.updateUser);
// Delete user (admin only)
router.delete('/:id', protect, admin, userController.deleteUser);

module.exports = router; 