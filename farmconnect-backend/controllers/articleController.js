const Article = require('../models/Article');

// Create article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, category, imageUrl } = req.body;
    const article = await Article.create({
      title,
      content,
      category,
      imageUrl,
      postedBy: req.user._id,
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all articles
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('postedBy', 'name email role');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get article by id
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('postedBy', 'name email role');
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    // Allow if admin or owner
    if (article.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = req.body;
    Object.assign(article, updates);
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    // Allow if admin or owner
    if (article.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 