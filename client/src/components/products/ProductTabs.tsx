import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Product, Review } from '../../types/product';
import ReviewList from './ReviewList';

interface ProductTabsProps {
  product: Product;
  publishedReviews: Review[];
  averageRating: number;
  renderStars: (rating: number) => JSX.Element;
  formatDate: (date: string) => string;
  onWriteReview: () => void;
}

const ProductTabs = ({ 
  product, 
  publishedReviews, 
  averageRating, 
  renderStars, 
  formatDate,
  onWriteReview
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  return (
    <div>
      <div className="border-b">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-3 px-4 font-medium border-b-2 mr-4 ${
              activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 font-medium border-b-2 mr-4 ${
              activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-medium border-b-2 flex items-center ${
              activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Reviews
            {publishedReviews.length > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-0.5">
                {publishedReviews.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="py-4">
        {activeTab === 'description' && (
          <div className="prose max-w-none text-gray-700">
            <p>{product.description}</p>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-600">SKU</div>
              <div className="text-sm font-medium">{product.id.substring(0, 8).toUpperCase()}</div>
              
              <div className="text-sm text-gray-600">Category</div>
              <div className="text-sm font-medium">{product.category.name}</div>
              
              <div className="text-sm text-gray-600">Added On</div>
              <div className="text-sm font-medium">{formatDate(product.createdAt)}</div>
              
              <div className="text-sm text-gray-600">Last Updated</div>
              <div className="text-sm font-medium">{formatDate(product.updatedAt)}</div>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            {/* Reviews summary */}
            {publishedReviews.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">out of 5</div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on {publishedReviews.length} reviews
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={onWriteReview}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 mb-4">Be the first to review this product</p>
                <button 
                  onClick={onWriteReview}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Write a Review
                </button>
              </div>
            )}
            
            {/* Review list */}
            {publishedReviews.length > 0 && (
              <ReviewList 
                reviews={publishedReviews} 
                renderStars={renderStars} 
                formatDate={formatDate} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;