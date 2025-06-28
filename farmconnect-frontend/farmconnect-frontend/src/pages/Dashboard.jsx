import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

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

  const farmerStats = [
    { title: 'My Products', value: '12', icon: '🌾', color: 'bg-green-500' },
    { title: 'Total Sales', value: '$2,450', icon: '💰', color: 'bg-yellow-500' },
    { title: 'Active Orders', value: '5', icon: '📦', color: 'bg-blue-500' },
    { title: 'Customer Rating', value: '4.8★', icon: '⭐', color: 'bg-purple-500' },
  ];

  const buyerStats = [
    { title: 'Orders Placed', value: '8', icon: '🛒', color: 'bg-blue-500' },
    { title: 'Total Spent', value: '$156', icon: '💰', color: 'bg-yellow-500' },
    { title: 'Favorite Farmers', value: '3', icon: '👨‍🌾', color: 'bg-green-500' },
    { title: 'Products Bought', value: '15', icon: '📦', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Welcome back, <span className="text-green-200">{user?.name}</span>!
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
                  {user?.role === 'farmer' 
                    ? 'Ready to showcase your products and connect with buyers?'
                    : 'Discover fresh, local produce from trusted farmers in your area.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {user?.role === 'farmer' ? (
                    <>
                      <Link 
                        to="/add-product" 
                        className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 text-lg"
                      >
                        ➕ Add New Product
                      </Link>
                      <Link 
                        to="/products" 
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 text-lg"
                      >
                        View My Products
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/products" 
                        className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 text-lg"
                      >
                        Browse Products
                      </Link>
                      <Link 
                        to="/chat" 
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 text-lg"
                      >
                        Chat with Farmers
                      </Link>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Dashboard Stats */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {user?.role === 'farmer' ? 'Your Farm Dashboard' : 'Your Shopping Dashboard'}
            </h2>
            <p className="text-gray-600 text-lg">
              {user?.role === 'farmer' 
                ? 'Track your products, sales, and customer interactions'
                : 'Monitor your orders, spending, and favorite farmers'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(user?.role === 'farmer' ? farmerStats : buyerStats).map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 text-center">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user?.role === 'farmer' ? (
                <>
                  <Link 
                    to="/add-product"
                    className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">➕</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Add New Product</h4>
                    <p className="text-gray-600 text-sm">List your latest harvest or products</p>
                  </Link>
                  <Link 
                    to="/products"
                    className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">📊</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Manage Products</h4>
                    <p className="text-gray-600 text-sm">Update prices, quantities, and availability</p>
                  </Link>
                  <Link 
                    to="/chat"
                    className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center hover:bg-purple-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">💬</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Messages</h4>
                    <p className="text-gray-600 text-sm">Respond to buyer inquiries</p>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/products"
                    className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center hover:bg-green-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">🛒</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Browse Products</h4>
                    <p className="text-gray-600 text-sm">Find fresh produce from local farmers</p>
                  </Link>
                  <Link 
                    to="/chat"
                    className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">💬</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Chat with Farmers</h4>
                    <p className="text-gray-600 text-sm">Ask questions about products</p>
                  </Link>
                  <Link 
                    to="/articles"
                    className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center hover:bg-purple-100 transition-colors duration-200"
                  >
                    <div className="text-4xl mb-3">📰</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Read Articles</h4>
                    <p className="text-gray-600 text-sm">Learn about farming and agriculture</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Public Stats Section */}
      {!isAuthenticated && (
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
      )}

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