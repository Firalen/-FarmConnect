const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment, images } = req.body;
  const userId = req.user.id;

  // Check if user has already reviewed this product
  const existingReview = await Review.findOne({ product: productId, user: userId });
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Create review
  const review = await Review.create({
    product: productId,
    user: userId,
    rating,
    title,
    comment,
    images: images || []
  });

  // Populate user info
  await review.populate('user', 'name avatar');

  // Update product average rating
  await updateProductRating(productId);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10, sort = 'newest', rating } = req.query;

  const query = { product: productId, reported: false };
  
  // Filter by rating if provided
  if (rating) {
    query.rating = parseInt(rating);
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'helpful':
      sortOption = { helpfulCount: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const reviews = await Review.find(query)
    .populate('user', 'name avatar')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await Review.countDocuments(query);

  res.json({
    success: true,
    data: reviews,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.find({ user: userId })
    .populate('product', 'name images price')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await Review.countDocuments({ user: userId });

  res.json({
    success: true,
    data: reviews,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    }
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment, images } = req.body;
  const userId = req.user.id;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== userId && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  const updatedReview = await Review.findByIdAndUpdate(
    id,
    { rating, title, comment, images },
    { new: true, runValidators: true }
  ).populate('user', 'name avatar');

  // Update product average rating
  await updateProductRating(review.product);

  res.json({
    success: true,
    data: updatedReview
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review or is admin
  if (review.user.toString() !== userId && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await Review.findByIdAndDelete(id);

  // Update product average rating
  await updateProductRating(review.product);

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markHelpful = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user already marked as helpful
  const alreadyHelpful = review.helpful.find(h => h.user.toString() === userId);
  
  if (alreadyHelpful) {
    // Remove helpful vote
    review.helpful = review.helpful.filter(h => h.user.toString() !== userId);
  } else {
    // Add helpful vote
    review.helpful.push({ user: userId });
  }

  await review.save();

  res.json({
    success: true,
    data: {
      helpfulCount: review.helpfulCount,
      isHelpful: !alreadyHelpful
    }
  });
});

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user is reporting their own review
  if (review.user.toString() === userId) {
    res.status(400);
    throw new Error('Cannot report your own review');
  }

  review.reported = true;
  review.reportReason = reason;
  await review.save();

  res.json({
    success: true,
    message: 'Review reported successfully'
  });
});

// @desc    Get review statistics for a product
// @route   GET /api/reviews/stats/:productId
// @access  Public
const getReviewStats = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const stats = await Review.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), reported: false } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return res.json({
      success: true,
      data: {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    });
  }

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].ratingDistribution.forEach(rating => {
    ratingDistribution[rating]++;
  });

  res.json({
    success: true,
    data: {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution
    }
  });
});

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), reported: false } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getReviewStats
}; 