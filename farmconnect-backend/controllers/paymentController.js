const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('buyer');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to the authenticated user
    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: order.currency || 'usd',
      metadata: {
        orderId: order._id.toString(),
        buyerId: order.buyer._id.toString(),
        farmerId: order.farmer.toString(),
      },
    });

    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error('Payment intent creation error:', err);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findOne({ paymentIntentId });
      
      if (order) {
        order.paymentStatus = 'paid';
        order.transactionId = paymentIntent.latest_charge;
        order.paymentAmount = paymentIntent.amount / 100;
        await order.save();

        // Emit real-time update if socket is available
        const io = req.app.get('io');
        if (io) {
          io.to(`user_${order.farmer}`).emit('order_payment_completed', {
            orderId: order._id,
            amount: order.paymentAmount,
          });
        }
      }
    }

    res.json({ success: true, status: paymentIntent.status });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
};

// Handle Stripe webhook
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
        
        if (order) {
          order.paymentStatus = 'paid';
          order.transactionId = paymentIntent.latest_charge;
          order.paymentAmount = paymentIntent.amount / 100;
          await order.save();
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const failedOrder = await Order.findOne({ paymentIntentId: failedPaymentIntent.id });
        
        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          await failedOrder.save();
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.stripeCustomerId,
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (err) {
    console.error('Get payment methods error:', err);
    res.status(500).json({ message: 'Failed to get payment methods' });
  }
}; 