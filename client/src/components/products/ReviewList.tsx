import { useState } from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import type { Review } from '../../types/product';

interface ReviewListProps {
  reviews: Review[];
  renderStars: (rating: number) => JSX.Element;
  formatDate: (date: string) => string;
}

const ReviewList = ({ reviews, renderStars, formatDate }: ReviewListProps) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [showReviewImages, setShowReviewImages] = useState<{[key: string]: boolean}>({});
  
  // Toggle review expansion
  const toggleReviewExpansion = (reviewId: string) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };
  
  // Toggle review images
  const toggleReviewImages = (reviewId: string) => {
    setShowReviewImages(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <div>
              <span className="font-medium">{review.user.firstName}</span>
              <div className="flex items-center mt-1">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(review.createdAt)}
            </div>
          </div>
          
          <h4 className="font-medium mb-2">{review.title}</h4>
          
          <div className="text-gray-700 mb-3">
            {expandedReview === review.id || review.content.length <= 200 ? (
              <p>{review.content}</p>
            ) : (
              <p>
                {review.content.substring(0, 200)}...
                <button
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="ml-1 text-primary hover:underline"
                >
                  Read more
                </button>
              </p>
            )}
            
            {expandedReview === review.id && review.content.length > 200 && (
              <button
                onClick={() => toggleReviewExpansion(review.id)}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Show less
              </button>
            )}
          </div>
          
          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="mb-3">
              <button 
                className="flex items-center text-sm text-primary hover:underline mb-2"
                onClick={() => toggleReviewImages(review.id)}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                {showReviewImages[review.id] ? 'Hide images' : `View ${review.images.length} image${review.images.length > 1 ? 's' : ''}`}
              </button>
              
              {showReviewImages[review.id] && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {review.images.map((image, idx) => (
                    <div key={idx} className="overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`Review by ${review.user.firstName} - image ${idx + 1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Admin reply */}
          {review.reply && (
            <div className="bg-gray-50 p-3 rounded-md mt-3">
              <h5 className="font-medium text-sm mb-1">Store Response:</h5>
              <p className="text-sm text-gray-700">{review.reply}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;