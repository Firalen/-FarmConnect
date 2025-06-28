import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id || product.id}`}>
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'} 
          alt={product.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop';
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 text-green-700 text-sm font-bold rounded-full shadow-sm">
            ETB {product.price}
          </span>
        </div>

        {/* Organic Badge */}
        {product.isOrganic && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full shadow-sm">
              🌱 Organic
            </span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`px-3 py-1 text-white text-xs font-medium rounded-full shadow-sm ${
            product.isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {product.isAvailable ? '✅ Available' : '❌ Out of Stock'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {product.description}
        </p>
        
        {/* Product Details */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{product.quantity} {product.unit}</span>
          <span>{product.location}</span>
        </div>
        
        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-semibold text-lg">
            ETB {product.price}
          </span>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 transform group-hover:scale-105">
            View Details
          </button>
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard; 