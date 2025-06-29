import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, cartItemCount } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    if (user?.role !== 'buyer') {
      alert('Only buyers can add products to cart');
      return;
    }

    try {
      setAddingToCart(true);
      addToCart(
        product, 
        quantity, 
        product.farmerId || product.farmer?._id, 
        product.farmerName || product.farmer?.name
      );
      
      // Show success feedback
      const button = document.querySelector(`[data-product-id="${product._id}"]`);
      if (button) {
        button.textContent = 'Added!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.textContent = 'Add to Cart';
          button.classList.remove('bg-green-600');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const isInStock = product.quantity > 0;
  const isOwnProduct = user?.role === 'farmer' && product.farmerId === user._id;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>
        {!isInStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {product.title}
          </h3>
          <span className="text-2xl font-bold text-green-600">
            ETB {product.price}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Farmer Info */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-xs">
              {(product.farmerName || product.farmer?.name || 'F').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {product.farmerName || product.farmer?.name || 'Farmer'}
          </span>
        </div>

        {/* Stock Info */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            Stock: {product.quantity} {product.unit}
          </span>
          <span className="text-sm text-gray-500">
            {product.location || 'Ethiopia'}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {isAuthenticated && user?.role === 'buyer' && !isOwnProduct && (
            <>
              {/* Quantity Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  disabled={!isInStock}
                >
                  {[...Array(Math.min(10, product.quantity))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || addingToCart}
                data-product-id={product._id}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          )}

          {/* View Details Button */}
          <Link
            to={`/products/${product._id}`}
            className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            View Details
          </Link>

          {/* Chat with Farmer Button */}
          {isAuthenticated && user?.role === 'buyer' && !isOwnProduct && (
            <Link
              to="/chat"
              className="block w-full text-center bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200"
            >
              Chat with Farmer
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 