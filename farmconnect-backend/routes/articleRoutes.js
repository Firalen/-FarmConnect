const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

// Create article (protected)
router.post('/', protect, articleController.createArticle);
// Get all articles
router.get('/', articleController.getArticles);
// Get article by id
router.get('/:id', articleController.getArticleById);
// Update article (protected)
router.put('/:id', protect, articleController.updateArticle);
// Delete article (protected)
router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router; 