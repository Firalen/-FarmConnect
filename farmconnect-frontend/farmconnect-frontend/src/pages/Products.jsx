import React from 'react';
import ProductCard from '.././components/ProductCard';

const dummyProducts = [
  { id: 1, title: 'Maize', description: 'Fresh maize from Oromia', price: 20, imageUrl: 'https://via.placeholder.com/150', category: 'Cereal' },
  { id: 2, title: 'Wheat', description: 'Organic wheat', price: 30, imageUrl: 'https://via.placeholder.com/150', category: 'Cereal' },
];

const Products = () => {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products; 