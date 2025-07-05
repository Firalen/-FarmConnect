import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/verify-email/${token}`);
        setMessage(res.data.message || 'Email verified successfully!');
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed.');
      } finally {
        setIsLoading(false);
      }
    };
    verifyEmail();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-green-600 hover:text-green-500 font-medium">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 