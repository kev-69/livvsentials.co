import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WriteReviewModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { 
    rating: number; 
    title: string; 
    content: string; 
    images: File[] 
  }) => Promise<void>;
}

const WriteReviewModal = ({ 
  productId, 
  productName, 
  isOpen, 
  onClose, 
  onSubmit 
}: WriteReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    // Limit to 4 images max
    if (images.length + selectedFiles.length > 4) {
      setError('You can upload a maximum of 4 images');
      return;
    }
    
    setImages([...images, ...selectedFiles]);
    
    // Create image previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (rating === 0) {
      toast.error('Please select a rating', {
        icon: '❗',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please provide a review title', {
        icon: '❗',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please provide review content', {
        icon: '❗',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit({
        rating,
        title,
        content,
        images
      });
      
      // Reset form
      setRating(5);
      setTitle('');
      setContent('');
      setImages([]);
      setImagePreviews([]);
      
      // Clean up image URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-lg font-semibold">Write a Review</h1>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4">
              {/* Product info */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">You're reviewing:</p>
                <p className="font-medium">{productName}</p>
              </div>
              
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= (hoveredRating || rating) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              
              {/* Content */}
              <div className="mb-4">
                <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary min-h-[100px]"
                  placeholder="Share your experience with this product"
                  required
                />
              </div>
              
              {/* Image upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Images (optional)
                </label>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 mb-2">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">Upload images (max 4)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={images.length >= 4}
                    />
                  </label>
                </div>
                
                {/* Image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"
                          aria-label="Remove image"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WriteReviewModal;