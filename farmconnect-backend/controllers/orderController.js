const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const buyerId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Validate and process items
    const processedItems = [];
    let totalAmount = 0;
    const farmerIds = new Set();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ message: `Product ${product.title} is not available` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for ${product.title}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      farmerIds.add(product.farmerId.toString());

      processedItems.push({
        product: {
          _id: product._id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          farmerName: product.farmerName,
        },
        quantity: item.quantity,
        unit: product.unit,
        totalPrice: itemTotal,
      });

      // Update product quantity
      await Product.findByIdAndUpdate(product._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Create separate orders for each farmer
    const orders = [];
    const farmerGroups = {};

    // Group items by farmer
    processedItems.forEach((item, index) => {
      const farmerId = items[index].farmerId;
      if (!farmerGroups[farmerId]) {
        farmerGroups[farmerId] = [];
      }
      farmerGroups[farmerId].push(item);
    });

    // Create order for each farmer
    for (const [farmerId, farmerItems] of Object.entries(farmerGroups)) {
      const farmerTotal = farmerItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      const order = await Order.create({
        buyer: buyerId,
        farmer: farmerId,
        items: farmerItems,
        totalAmount: farmerTotal,
        shippingAddress,
        paymentMethod,
        notes,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

      await order.populate('buyer', 'name email');
      await order.populate('farmer', 'name email');
      
      orders.push(order);
    }

    res.status(201).json(orders);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all orders for a user (buyer or farmer)
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    let orders;
    if (user.role === 'farmer') {
      // Get orders where user is the farmer
      orders = await Order.find({ farmer: userId })
        .populate('buyer', 'name email phone')
        .populate('farmer', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get orders where user is the buyer
      orders = await Order.find({ buyer: userId })
        .populate('buyer', 'name email')
        .populate('farmer', 'name email phone')
        .sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    const userId = req.user._id;
    if (order.buyer._id.toString() !== userId.toString() && 
        order.farmer._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status (farmer only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only farmer can update order status
    if (order.farmer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the farmer can update order status' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [],
      'cancelled': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }

    // Update order
    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }
    if (status === 'cancelled') {
      // Restore product quantities
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    await order.save();
    await order.populate('buyer', 'name email');
    await order.populate('farmer', 'name email');

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: err.message });
  }
};

// Cancel order (buyer only)
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only buyer can cancel order
    if (order.buyer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the buyer can cancel the order' });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending orders' });
    }

    // Cancel order
    order.status = 'cancelled';
    order.paymentStatus = 'refunded';

    // Restore product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: item.quantity }
      });
    }

    await order.save();
    await order.populate('buyer', 'name email');
    await order.populate('farmer', 'name email');

    res.json(order);
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    let stats;
    if (user.role === 'farmer') {
      // Farmer statistics
      const totalOrders = await Order.countDocuments({ farmer: userId });
      const pendingOrders = await Order.countDocuments({ 
        farmer: userId, 
        status: 'pending' 
      });
      const totalRevenue = await Order.aggregate([
        { $match: { farmer: userId, status: { $in: ['delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      stats = {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders: await Order.find({ farmer: userId })
          .populate('buyer', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
      };
    } else {
      // Buyer statistics
      const totalOrders = await Order.countDocuments({ buyer: userId });
      const activeOrders = await Order.countDocuments({ 
        buyer: userId, 
        status: { $in: ['pending', 'confirmed', 'shipped'] } 
      });
      const totalSpent = await Order.aggregate([
        { $match: { buyer: userId, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      stats = {
        totalOrders,
        activeOrders,
        totalSpent: totalSpent[0]?.total || 0,
        recentOrders: await Order.find({ buyer: userId })
          .populate('farmer', 'name')
          .sort({ createdAt: -1 })
          .limit(5)
      };
    }

    res.json(stats);
  } catch (err) {
    console.error('Error fetching order stats:', err);
    res.status(500).json({ message: err.message });
  }
}; 