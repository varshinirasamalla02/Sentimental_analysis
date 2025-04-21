import React, { useState, useEffect } from 'react';
import { BarChart3, Loader, ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  id: string;
  name: string;
}

interface SentimentResult {
  product: string;
  positiveAspects: string[];
  negativeAspects: string[];
  neutralAspects: string[];
  overallSentiment: number;
  sentimentBreakdown: {
    [key: string]: number;
  };
}

const SentimentAnalysis: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = async (productId: string) => {
    setAnalyzing(true);
    setSentimentResult(null);
    
    try {
      const response = await axios.get(`/api/sentiment/analyze/${productId}/`);
      setSentimentResult(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
      console.error('Error analyzing sentiment:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    analyzeSentiment(productId);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderChart = () => {
    if (!sentimentResult) return null;
    
    const aspects = Object.keys(sentimentResult.sentimentBreakdown);
    const sentimentScores = aspects.map(aspect => sentimentResult.sentimentBreakdown[aspect]);
    
    const chartData = {
      labels: aspects,
      datasets: [
        {
          label: 'Sentiment Score',
          data: sentimentScores,
          backgroundColor: sentimentScores.map(score => 
            score > 0.6 ? 'rgba(16, 185, 129, 0.6)' : 
            score < 0.4 ? 'rgba(239, 68, 68, 0.6)' : 
            'rgba(245, 158, 11, 0.6)'
          ),
          borderColor: sentimentScores.map(score => 
            score > 0.6 ? 'rgb(16, 185, 129)' : 
            score < 0.4 ? 'rgb(239, 68, 68)' : 
            'rgb(245, 158, 11)'
          ),
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Sentiment Analysis by Aspect',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
        },
      },
    };
    
    return <Bar data={chartData} options={options} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Sentiment Analysis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a product to analyze review sentiments and gain valuable insights.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6 md:col-span-1">
          <div className="mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-3">Select a Product</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No products found</p>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    selectedProduct === product.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleProductSelect(product.id)}
                >
                  {product.name}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 md:col-span-3">
          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-sm text-gray-500">Analyzing sentiments, please wait...</p>
            </div>
          ) : !selectedProduct ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-sm text-gray-500">Select a product to view sentiment analysis</p>
            </div>
          ) : sentimentResult ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Sentiment Analysis for {sentimentResult.product}
              </h3>
              
              <div className="mb-8">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <div className={`text-lg font-medium ${
                      sentimentResult.overallSentiment > 0.6 
                        ? 'text-green-600' 
                        : sentimentResult.overallSentiment < 0.4 
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                    }`}>
                      Overall Sentiment: {Math.round(sentimentResult.overallSentiment * 100)}%
                    </div>
                    <div className="ml-2">
                      {sentimentResult.overallSentiment > 0.6 
                        ? <ThumbsUp className="h-5 w-5 text-green-600" /> 
                        : sentimentResult.overallSentiment < 0.4 
                          ? <ThumbsDown className="h-5 w-5 text-red-600" /> 
                          : null}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        sentimentResult.overallSentiment > 0.6 
                          ? 'bg-green-600' 
                          : sentimentResult.overallSentiment < 0.4 
                            ? 'bg-red-600' 
                            : 'bg-yellow-500'
                      }`} 
                      style={{ width: `${sentimentResult.overallSentiment * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="text-sm font-medium text-green-800 flex items-center mb-3">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Positive Aspects
                    </h4>
                    {sentimentResult.positiveAspects.length === 0 ? (
                      <p className="text-sm text-gray-500">No positive aspects found</p>
                    ) : (
                      <ul className="space-y-1">
                        {sentimentResult.positiveAspects.map((aspect, index) => (
                          <li key={index} className="text-sm text-gray-700">• {aspect}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="text-sm font-medium text-red-800 flex items-center mb-3">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Negative Aspects
                    </h4>
                    {sentimentResult.negativeAspects.length === 0 ? (
                      <p className="text-sm text-gray-500">No negative aspects found</p>
                    ) : (
                      <ul className="space-y-1">
                        {sentimentResult.negativeAspects.map((aspect, index) => (
                          <li key={index} className="text-sm text-gray-700">• {aspect}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h4 className="text-sm font-medium text-yellow-800 flex items-center mb-3">
                      Neutral Aspects
                    </h4>
                    {sentimentResult.neutralAspects.length === 0 ? (
                      <p className="text-sm text-gray-500">No neutral aspects found</p>
                    ) : (
                      <ul className="space-y-1">
                        {sentimentResult.neutralAspects.map((aspect, index) => (
                          <li key={index} className="text-sm text-gray-700">• {aspect}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Sentiment by Aspect</h4>
                {renderChart()}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-gray-500">No analysis data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;