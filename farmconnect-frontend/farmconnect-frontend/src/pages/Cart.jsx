import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, cartTotal, cartItemCount, itemsByFarmer, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (user?.role !== 'buyer') {
      alert('Only buyers can place orders');
      return;
    }

    if (cartItemCount === 0) {
      alert('Your cart is empty');
      return;
    }

    // Validate shipping address
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setCheckoutLoading(true);
      
      // Convert cart items to order format
      const orderItems = Object.values(itemsByFarmer).map(farmerGroup => {
        return {
          farmerId: farmerGroup.farmerId,
          items: farmerGroup.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            farmerId: item.farmerId
          }))
        };
      }).flat();

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: 'cash_on_delivery',
        notes: ''
      };

      await ordersAPI.create(orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Redirect to orders page
      window.location.href = '/orders';
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">Please login to view your cart</p>
            <Link
              to="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-6">Only buyers can access the shopping cart</p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItemCount > 0 
              ? `You have ${cartItemCount} item${cartItemCount > 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'
            }
          </p>
        </div>

        {cartItemCount === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {Object.values(itemsByFarmer).map((farmerGroup) => (
                    <div key={farmerGroup.farmerId} className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {farmerGroup.farmerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{farmerGroup.farmerName}</h3>
                          <p className="text-sm text-gray-500">Farmer</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {farmerGroup.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                              src={item.product.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&h=100&fit=crop'}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{item.product.title}</h4>
                              <p className="text-sm text-gray-600">{item.product.description}</p>
                              <p className="text-sm text-gray-500">ETB {item.product.price} per {item.product.unit}</p>
                            </div>

                            <div className="flex items-center space-x-3">
                              <select
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                              >
                                {[...Array(10)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>

                              <div className="text-right">
                                <p className="font-semibold text-gray-800">ETB {item.product.price * item.quantity}</p>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Checkout</h2>

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">ETB {cartTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Total:</span>
                        <span className="font-bold text-green-600 text-lg">ETB {cartTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address Form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Shipping Address</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={checkoutLoading || cartItemCount === 0}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {checkoutLoading ? 'Processing...' : `Place Order (ETB ${cartTotal})`}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <Link
                    to="/products"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 