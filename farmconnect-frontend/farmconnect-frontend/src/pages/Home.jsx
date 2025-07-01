import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              {t('welcome')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('home_hero_desc', 'Connecting Ethiopian farmers directly with buyers. Fresh, local produce delivered to your doorstep. Support sustainable agriculture and enjoy the best quality products.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200"
              >
                {t('browse_products', 'Browse Products')}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200"
                >
                  {t('join_now', 'Join Now')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('why_choose', 'Why Choose FarmConnect?')}</h2>
            <p className="text-gray-600 text-lg">{t('direct_connection', 'Direct connection between farmers and consumers')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('fresh_from_farm', 'Fresh from Farm')}</h3>
              <p className="text-gray-600">{t('fresh_desc', 'Get fresh, organic produce directly from local farmers')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('fair_prices', 'Fair Prices')}</h3>
              <p className="text-gray-600">{t('fair_prices_desc', 'Better prices for both farmers and consumers')}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('fast_delivery', 'Fast Delivery')}</h3>
              <p className="text-gray-600">{t('fast_delivery_desc', 'Quick and reliable delivery to your location')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('ready_to_start', 'Ready to get started?')}
          </h2>
          <p className="text-green-100 text-lg mb-8">
            {t('join_thousands', 'Join thousands of farmers and buyers already using FarmConnect')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {t('start_shopping', 'Start Shopping')}
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                {t('create_account', 'Create Account')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 