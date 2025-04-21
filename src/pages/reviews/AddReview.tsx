import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Star } from 'lucide-react';
import axios from 'axios';

interface ReviewFormData {
  product: string;
  rating: number;
  review: string;
}

const AddReview: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5
    }
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const currentRating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);
    try {
      await axios.post('/api/reviews/', data);
      navigate('/reviews');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setValue('rating', rating);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Add New Review
          </h2>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="product"
                className={`mt-1 block w-full border ${
                  errors.product ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                {...register('product', { required: 'Product name is required' })}
              />
              {errors.product && (
                <p className="mt-1 text-sm text-red-600">{errors.product.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleStarClick(rating)}
                    className="focus:outline-none mr-1"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">{currentRating} out of 5</span>
              </div>
              <input
                type="hidden"
                {...register('rating', { required: 'Rating is required' })}
              />
            </div>

            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Review
              </label>
              <textarea
                id="review"
                rows={5}
                className={`mt-1 block w-full border ${
                  errors.review ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Write your review here..."
                {...register('review', { 
                  required: 'Review content is required',
                  minLength: {
                    value: 10,
                    message: 'Review must be at least 10 characters'
                  }
                })}
              ></textarea>
              {errors.review && (
                <p className="mt-1 text-sm text-red-600">{errors.review.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={() => navigate('/reviews')}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReview;