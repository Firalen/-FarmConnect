const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/stats/:productId', getReviewStats);

// Protected routes
router.use(protect);
router.post('/', createReview);
router.get('/user', getUserReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/report', reportReview);

module.exports = router; 