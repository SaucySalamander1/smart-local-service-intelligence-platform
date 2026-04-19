import React, { useState } from 'react';

const RatingModal = ({ workerId, workerName, jobTitle, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        rating,
        review: review.trim()
      });
      // Modal will close after successful submission
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">How was your experience?</h2>
          <p className="text-gray-600 text-sm">Rate your work with {workerName}</p>
          <p className="text-gray-500 text-xs mt-1">📋 {jobTitle}</p>
        </div>

        {/* Star Rating */}
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-all duration-200"
            >
              <span
                className={`text-4xl cursor-pointer transition-all ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 scale-110'
                    : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            </button>
          ))}
        </div>

        {/* Rating Display */}
        {rating > 0 && (
          <div className="text-center mb-6">
            <p className="text-lg font-bold text-gray-800">
              {rating === 5 && 'Excellent! 🎉'}
              {rating === 4 && 'Great! 😊'}
              {rating === 3 && 'Good! 👍'}
              {rating === 2 && 'Okay 😐'}
              {rating === 1 && 'Not satisfied 😕'}
            </p>
          </div>
        )}

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Share your feedback (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us about your experience with this worker..."
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {review.length}/500 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Submitting...' : '✅ Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
