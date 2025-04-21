import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Star, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';

interface ReviewFormData {
  product: string;
  rating: number;
  review: string;
}

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ReviewFormData>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  const currentRating = watch('rating');

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/reviews/${id}/`);
        const review = response.data;
        
        reset({
          product: review.product,
          rating: review.rating,
          review: review.review
        });
      } catch (err) {
        setError('Failed to load review. Please try again.');
        console.error('Error fetching review:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, reset]);

  const onSubmit = async (data: ReviewFormData) => {
    setSaving(true);
    try {
      await axios.put(`/api/reviews/${id}/`, data);
      navigate('/reviews');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setValue('rating', rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Reviews
          </button>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Review
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
              disabled={saving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Update Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewDetail;