const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Order routes
router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/stats', protect, orderController.getOrderStats);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, orderController.updateOrderStatus);
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router; 