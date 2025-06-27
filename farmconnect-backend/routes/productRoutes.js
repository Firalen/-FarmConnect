const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Create product (protected)
router.post('/', protect, productController.createProduct);
// Get all products
router.get('/', productController.getProducts);
// Get product by id
router.get('/:id', productController.getProductById);
// Update product (protected)
router.put('/:id', protect, productController.updateProduct);
// Delete product (protected)
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router; 