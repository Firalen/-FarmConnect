import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl">FarmConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>🌾</span>
              <span>Products</span>
            </Link>
            <Link 
              to="/articles" 
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>📰</span>
              <span>Articles</span>
            </Link>
            <Link 
              to="/chat" 
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>💬</span>
              <span>Chat</span>
            </Link>
            <Link 
              to="/admin" 
              className="text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1"
            >
              <span>⚙️</span>
              <span>Admin</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-green-200 focus:outline-none focus:text-green-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-700 rounded-lg mt-2">
              <Link 
                to="/products" 
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🌾 Products
              </Link>
              <Link 
                to="/articles" 
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                📰 Articles
              </Link>
              <Link 
                to="/chat" 
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                💬 Chat
              </Link>
              <Link 
                to="/admin" 
                className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚙️ Admin
              </Link>
              <div className="pt-4 pb-3 border-t border-green-600">
                <Link 
                  to="/login" 
                  className="text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-green-600 block px-3 py-2 rounded-md text-base font-medium mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 