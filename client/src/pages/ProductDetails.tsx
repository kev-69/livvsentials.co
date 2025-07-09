import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, post } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { toast, Toaster } from 'sonner';
import { Star, ArrowLeft } from 'lucide-react';
import type { Product } from '../types/product';
import { FullPageLoader } from '../components/ui/BrandedLoader';


// Import components
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductInfo from '../components/products/ProductInfo';
import ProductTabs from '../components/products/ProductTabs';
import ImageModal from '../components/products/ImageModal';
import WriteReviewModal from '../components/products/WriteReviewModal';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await get(`/products/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };
    
    fetchProduct();
  }, [slug]);
  
  // Increment quantity
  const incrementQuantity = () => {
    if (product?.stockQuantity && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error('Cannot add more. Maximum stock reached.',{
        icon: '🚫',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
    }
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  // Add to wishlist
  const handleToggleWishlist = async () => {
    if (!product) return;
    
    try {
      await toggleWishlistItem(product.id);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };
  
  // Share product
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard', {
        icon: '📋',
        style: { backgroundColor: '#F0F4F8', color: '#1E40AF' }
      });
    }
  };
  
  // Open image modal
  const openModal = (image: string) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };
  
  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Render stars for rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Submit review
  const handleSubmitReview = async (reviewData: { 
    rating: number; 
    title: string; 
    content: string; 
    images: File[] 
  }) => {
    if (!product) return;
    
    try {
      // Create FormData for image uploads
      const formData = new FormData();
      formData.append('productId', product.id);
      formData.append('rating', reviewData.rating.toString());
      formData.append('title', reviewData.title);
      formData.append('content', reviewData.content);
      
      reviewData.images.forEach(image => {
        formData.append('images', image);
      });
      
      await post('/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Review submitted successfully! It will be published after review.', {
        icon: '✅',
        style: { backgroundColor: '#ECFDF5', color: '#065F46' }
      });
      
      // Refresh product data to show the new review (if it's auto-published)
      const updatedProduct = await get(`/products/${slug}`);
      setProduct(updatedProduct);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      throw error;
    }
  };
  
  // Calculate average rating
  const calculateAverageRating = (product: Product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const publishedReviews = product.reviews.filter(r => r.status === 'PUBLISHED');
    if (publishedReviews.length === 0) return 0;
    
    const sum = publishedReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / publishedReviews.length;
  };
  
  // Get published reviews
  const getPublishedReviews = (product: Product) => {
    if (!product || !product.reviews) return [];
    return product.reviews.filter(review => review.status === 'PUBLISHED');
  };
  
  // Loading state
  if (isLoading) {
    return <FullPageLoader animation="wave" />;
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-medium text-red-700 mb-4">
            {error || 'Product not found'}
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }
  
  // Check if product is in wishlist
  const inWishlist = isInWishlist(product.id);
  
  // Get published reviews
  const publishedReviews = getPublishedReviews(product);
  const averageRating = calculateAverageRating(product);
  
  return (
    <div className="bg-white">
      <Toaster position="top-center" />
      
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <ProductImageGallery 
            images={product.productImages} 
            productName={product.name} 
            onImageClick={openModal} 
          />
          
          {/* Product Info */}
          <div className="flex flex-col">
            <ProductInfo 
              product={product}
              quantity={quantity}
              inWishlist={inWishlist}
              publishedReviews={publishedReviews}
              averageRating={averageRating}
              onAddToCart={handleAddToCart}
              onHandleShare={handleShare}
              onToggleWishlist={handleToggleWishlist}
              onDecrementQuantity={decrementQuantity}
              onIncrementQuantity={incrementQuantity}
              onWriteReview={() => setShowReviewModal(true)}
              renderStars={renderStars}
            />
            
            {/* Product Tabs */}
            <div className="mt-auto">
              <ProductTabs
                product={product}
                publishedReviews={publishedReviews}
                averageRating={averageRating}
                renderStars={renderStars}
                formatDate={formatDate}
                onWriteReview={() => setShowReviewModal(true)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        alt={product.name}
        onClose={closeModal}
        onShare={handleShare}
      />
      
      {/* Write Review Modal */}
      <WriteReviewModal
        productId={product.id}
        productName={product.name}
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default ProductDetails;