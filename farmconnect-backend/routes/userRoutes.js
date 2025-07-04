const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  // Successful authentication, respond with JWT
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { expiresIn: '7d' }
  );
  // You can redirect with token as query param or send as JSON
  res.redirect(`/social-login-success?token=${token}`);
});
// Facebook OAuth
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', session: false }), (req, res) => {
  // Successful authentication, respond with JWT
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    { expiresIn: '7d' }
  );
  res.redirect(`/social-login-success?token=${token}`);
});

module.exports = router; 