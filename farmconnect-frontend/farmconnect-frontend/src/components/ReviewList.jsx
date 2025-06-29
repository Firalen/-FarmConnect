import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaFlag, FaUser, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ReviewList = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId, currentPage, sortBy, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5,
        sort: sortBy
      });
      
      if (ratingFilter) {
        params.append('rating', ratingFilter);
      }

      const response = await api.get(`/reviews/product/${productId}?${params}`);
      setReviews(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/reviews/stats/${productId}`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      setReviews(prev => prev.map(review => 
        review._id === reviewId 
          ? { ...review, helpfulCount: response.data.data.helpfulCount }
          : review
      ));
    } catch (error) {
      console.error('Error marking helpful:', error);
      toast.error('Failed to mark review as helpful');
    }
  };

  const handleReportReview = async (reviewId, reason) => {
    try {
      await api.post(`/reviews/${reviewId}/report`, { reason });
      toast.success('Review reported successfully');
    } catch (error) {
      console.error('Error reporting review:', error);
      toast.error('Failed to report review');
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await api.post('/reviews', reviewData);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      fetchReviews();
      fetchStats();
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } text-sm`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {stats.totalReviews} reviews
                </div>
              </div>
              
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-4">{rating}★</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${stats.totalReviews > 0 
                            ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 
                            : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">
                      {stats.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Write a Review
              </button>
            )}
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm
              productId={productId}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        
        {!user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FaCalendar className="text-xs" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-semibold text-lg">{review.title}</h4>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleMarkHelpful(review._id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <FaThumbsUp className="text-sm" />
                    <span className="text-sm">Helpful ({review.helpfulCount || 0})</span>
                  </button>
                </div>
                
                {user && review.user._id !== user.id && (
                  <button
                    onClick={() => handleReportReview(review._id, 'inappropriate')}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FaFlag className="text-sm" />
                    <span className="text-sm">Report</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList; 