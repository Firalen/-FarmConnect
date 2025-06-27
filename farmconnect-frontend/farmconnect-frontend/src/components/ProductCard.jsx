import React from 'react';

const ProductCard = ({ product }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
    <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover rounded" />
    <h3 className="text-lg font-bold mt-2">{product.title}</h3>
    <p className="text-gray-600">{product.description}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-green-700 font-bold">${product.price}</span>
      <span className="text-xs text-gray-500">{product.category}</span>
    </div>
  </div>
);

export default ProductCard; 