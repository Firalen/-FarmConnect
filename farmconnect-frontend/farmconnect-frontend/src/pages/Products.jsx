import React, { useState, useEffect } from 'react';
import ProductCard from '.././components/ProductCard';
import { productsAPI } from '../services/api';

const categories = ['All', 'Cereal', 'Vegetables', 'Dairy', 'Beverages'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getAll();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        // Fallback to dummy data for demo
        const dummyProducts = [
          { id: 1, title: 'Fresh Maize', description: 'Premium quality maize from Oromia region', price: 25, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop', category: 'Cereal' },
          { id: 2, title: 'Organic Wheat', description: 'Certified organic wheat grains', price: 35, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', category: 'Cereal' },
          { id: 3, title: 'Fresh Tomatoes', description: 'Ripe and juicy tomatoes from local farms', price: 15, imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', category: 'Vegetables' },
          { id: 4, title: 'Sweet Potatoes', description: 'Organic sweet potatoes from Tigray', price: 12, imageUrl: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400&h=300&fit=crop', category: 'Vegetables' },
          { id: 5, title: 'Coffee Beans', description: 'Premium Arabica coffee beans', price: 45, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop', category: 'Beverages' },
          { id: 6, title: 'Honey', description: 'Pure natural honey from local beekeepers', price: 28, imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', category: 'Dairy' },
          { id: 7, title: 'Fresh Milk', description: 'Fresh cow milk from local dairy farms', price: 18, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', category: 'Dairy' },
          { id: 8, title: 'Green Peppers', description: 'Fresh green peppers from Amhara', price: 8, imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=300&fit=crop', category: 'Vegetables' },
          { id: 9, title: 'Teff Flour', description: 'Traditional Ethiopian teff flour', price: 22, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', category: 'Cereal' },
        ];
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-600">Loading products...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover fresh, local produce from trusted farmers across Ethiopia. Support sustainable agriculture and enjoy the best quality products.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">View:</span>
            <button className="p-2 bg-green-100 text-green-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 