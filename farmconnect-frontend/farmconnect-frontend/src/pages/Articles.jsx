import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { articlesAPI } from '../services/api';

const Articles = () => {
  const { user, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Farming Tips', 'Market Trends', 'Technology', 'Sustainability', 'Health & Nutrition'];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getAll();
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
      // Fallback to dummy data
      const dummyArticles = [
        {
          _id: '1',
          title: 'Sustainable Farming Practices for Ethiopian Farmers',
          content: 'Learn about eco-friendly farming methods that can improve your crop yields while protecting the environment...',
          excerpt: 'Discover sustainable farming techniques that are perfect for Ethiopian climate and soil conditions.',
          author: { name: 'Dr. Abebe Kebede', role: 'Agricultural Expert' },
          category: 'Sustainability',
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
          readTime: '5 min read',
          publishedAt: '2024-01-15T10:00:00Z',
          views: 1250
        },
        {
          _id: '2',
          title: 'Market Trends: Coffee Prices in 2024',
          content: 'The coffee market is experiencing significant changes this year. Here\'s what Ethiopian coffee farmers need to know...',
          excerpt: 'Stay updated with the latest coffee market trends and pricing strategies for 2024.',
          author: { name: 'Sara Mohammed', role: 'Market Analyst' },
          category: 'Market Trends',
          imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop',
          readTime: '3 min read',
          publishedAt: '2024-01-12T14:30:00Z',
          views: 890
        },
        {
          _id: '3',
          title: 'Modern Irrigation Techniques for Small Farms',
          content: 'Water conservation is crucial for sustainable farming. Here are modern irrigation methods that can help...',
          excerpt: 'Explore efficient irrigation systems that can save water and improve crop productivity.',
          author: { name: 'Engineer Tewodros Alemu', role: 'Irrigation Specialist' },
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
          readTime: '7 min read',
          publishedAt: '2024-01-10T09:15:00Z',
          views: 1560
        },
        {
          _id: '4',
          title: 'Organic Pest Control Methods',
          content: 'Chemical pesticides can harm both crops and consumers. Learn about natural pest control alternatives...',
          excerpt: 'Discover organic methods to protect your crops from pests without using harmful chemicals.',
          author: { name: 'Dr. Fatima Hassan', role: 'Plant Pathologist' },
          category: 'Farming Tips',
          imageUrl: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&h=400&fit=crop',
          readTime: '6 min read',
          publishedAt: '2024-01-08T16:45:00Z',
          views: 1120
        },
        {
          _id: '5',
          title: 'Nutritional Benefits of Ethiopian Superfoods',
          content: 'Ethiopia is home to many nutritious traditional foods. Learn about their health benefits...',
          excerpt: 'Explore the nutritional value of traditional Ethiopian foods and their health benefits.',
          author: { name: 'Dr. Yohannes Tadesse', role: 'Nutritionist' },
          category: 'Health & Nutrition',
          imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=400&fit=crop',
          readTime: '4 min read',
          publishedAt: '2024-01-05T11:20:00Z',
          views: 980
        }
      ];
      setArticles(dummyArticles);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by published date (newest first)
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    setFilteredArticles(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <span className="text-lg text-gray-600">Loading articles...</span>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Advisory Articles</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Stay informed with the latest farming tips, market trends, and agricultural insights from experts in the field.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <article key={article._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                    <span className="mx-2">•</span>
                    <span>{article.views} views</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {article.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{article.author.name}</p>
                        <p className="text-gray-500 text-xs">{article.author.role}</p>
                      </div>
                    </div>
                    <Link
                      to={`/articles/${article._id}`}
                      className="text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles; 