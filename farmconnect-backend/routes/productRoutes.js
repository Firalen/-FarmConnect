const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create product (protected) - with file upload
router.post('/', protect, upload.single('image'), productController.createProduct);
// Get all products
router.get('/', productController.getProducts);
// Get product by id
router.get('/:id', productController.getProductById);
// Update product (protected) - with file upload
router.put('/:id', protect, upload.single('image'), productController.updateProduct);
// Delete product (protected)
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router; 