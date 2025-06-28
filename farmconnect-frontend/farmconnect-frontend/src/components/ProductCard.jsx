import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`}>
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
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
            ${product.price}
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
        
        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-green-600 font-semibold text-lg">
            ${product.price}
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