import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Dashboard = () => {
  const featuredProducts = [
    { id: 1, title: 'Fresh Maize', description: 'Premium quality maize from Oromia region', price: 25, imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop', category: 'Cereal' },
    { id: 2, title: 'Organic Wheat', description: 'Certified organic wheat grains', price: 35, imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', category: 'Cereal' },
    { id: 3, title: 'Fresh Tomatoes', description: 'Ripe and juicy tomatoes from local farms', price: 15, imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', category: 'Vegetables' },
  ];

  const stats = [
    { title: 'Active Farmers', value: '1,234', icon: '👨‍🌾', color: 'bg-blue-500' },
    { title: 'Products Listed', value: '567', icon: '🌾', color: 'bg-green-500' },
    { title: 'Total Sales', value: '$89K', icon: '💰', color: 'bg-yellow-500' },
    { title: 'Happy Customers', value: '890', icon: '😊', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-green-200">FarmConnect</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Connecting farmers with consumers. Discover fresh, local produce and support sustainable agriculture.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 text-lg"
              >
                Browse Products
              </Link>
              <Link 
                to="/register" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 text-lg"
              >
                Join as Farmer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 text-center">
              <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium agricultural products from trusted local farmers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            View All Products
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose FarmConnect?</h2>
            <p className="text-gray-600 text-lg">We're committed to revolutionizing the agricultural marketplace</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh & Local</h3>
              <p className="text-gray-600">Direct from farm to table, ensuring the freshest produce for our customers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fair Trade</h3>
              <p className="text-gray-600">Supporting local farmers with fair pricing and transparent transactions.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to ensure your products arrive fresh and on time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 