import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Book, Search, ThumbsUp, ThumbsDown, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalProducts: 0,
    positiveReviews: 0,
    negativeReviews: 0
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated) {
        try {
          // Fetch stats
          const statsResponse = await axios.get('/api/stats/');
          setStats(statsResponse.data);

          // Fetch top products
          const productsResponse = await axios.get('/api/products/top/');
          setTopProducts(productsResponse.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sentiment Analysis Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Extract valuable insights from product reviews using advanced sentiment analysis
        </p>
      </div>

      {isAuthenticated ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <Book className="h-10 w-10 text-blue-500" />
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Reviews</h2>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <Search className="h-10 w-10 text-purple-500" />
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <ThumbsUp className="h-10 w-10 text-green-500" />
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Positive Reviews</h2>
                  <p className="text-2xl font-bold text-gray-900">{stats.positiveReviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center">
                <ThumbsDown className="h-10 w-10 text-red-500" />
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Negative Reviews</h2>
                  <p className="text-2xl font-bold text-gray-900">{stats.negativeReviews}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sentiment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.reviewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.sentiment > 0.6 
                              ? 'bg-green-100 text-green-800' 
                              : product.sentiment < 0.4 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.sentiment > 0.6 
                            ? 'Positive' 
                            : product.sentiment < 0.4 
                              ? 'Negative' 
                              : 'Mixed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/reviews"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Book className="h-6 w-6 text-blue-500" />
                  <span className="ml-3 text-gray-900">View Reviews</span>
                </Link>
                <Link
                  to="/reviews/add"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Book className="h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-900">Add Review</span>
                </Link>
                <Link
                  to="/analysis"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  <span className="ml-3 text-gray-900">Sentiment Analysis</span>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Updated sentiment analysis for iPhone 16
                    </p>
                    <p className="text-sm text-gray-500">
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Added 25 new reviews for Samsung Galaxy
                    </p>
                    <p className="text-sm text-gray-500">
                      Yesterday
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Ran sentiment analysis on Redmi Note 3
                    </p>
                    <p className="text-sm text-gray-500">
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-blue-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Welcome to SentimentHub
            </h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">
              Please login or create an account to start analyzing product reviews and gaining valuable insights.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;