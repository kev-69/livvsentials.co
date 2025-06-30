import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { toast, Toaster } from 'sonner';
import { 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Star, 
  Truck, 
  RefreshCw, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import Masonry from 'react-masonry-css';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  
  // State
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await get(`/products/${slug}`);
        setProduct(data);
        
        // Set the first image as selected
        if (data.productImages && data.productImages.length > 0) {
          setSelectedImage(data.productImages[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug]);
  
  // Increment quantity
  const incrementQuantity = () => {
    if (product?.stockQuantity && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.error('Cannot add more. Maximum stock reached.');
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
      toast.success('Link copied to clipboard');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
  
  // Format price display
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  // Check if product is in wishlist
  const inWishlist = isInWishlist(product.id);
  
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
          {/* Product Images - Pinterest Style Gallery */}
          <div>
            {product.productImages && product.productImages.length > 0 ? (
              <Masonry
                breakpointCols={{
                  default: 2,
                  700: 2,
                  500: 1
                }}
                className="flex w-full gap-4"
                columnClassName="masonry-grid_column"
              >
                {product.productImages.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className={`mb-4 overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedImage === image ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - view ${index + 1}`} 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                      style={{ minHeight: '100px' }} // Ensures minimum height for small images
                    />
                  </div>
                ))}
              </Masonry>
            ) : (
              <div className="bg-gray-100 rounded-lg w-full aspect-square flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category & Name */}
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-2">{product.category.name}</p>
              <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary mr-3">
                    GHS {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    GHS {formatPrice(product.price)}
                  </span>
                  <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  GHS {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <p className="text-green-600 font-medium flex items-center">
                  <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
                  In Stock
                  {product.stockQuantity > 0 && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({product.stockQuantity} available)
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-red-600 font-medium flex items-center">
                  <span className="h-2 w-2 bg-red-600 rounded-full mr-2"></span>
                  Out of Stock
                </p>
              )}
            </div>
            
            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Quantity</p>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 border rounded-l-md hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 border-t border-b min-w-[50px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 border rounded-r-md hover:bg-gray-50 transition-colors"
                    disabled={product.stockQuantity && quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md font-medium text-white 
                  ${product.inStock ? 'bg-primary hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'}
                  transition-colors`}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center py-3 px-4 rounded-md border 
                  ${inWishlist ? 'border-pink-200 bg-pink-50 text-pink-600' : 'border-gray-300 hover:bg-gray-50'} 
                  transition-colors`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center justify-center py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Product Benefits */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2 text-primary" />
                <span>Free delivery on orders over GHS 100</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                <span>30-day return policy</span>
              </div>
            </div>
            
            {/* Product Tabs */}
            <div className="mt-auto">
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
                    className={`py-3 px-4 font-medium border-b-2 ${
                      activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Reviews
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
                      
                      {/* Add more product details as needed */}
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">Be the first to review this product</p>
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;