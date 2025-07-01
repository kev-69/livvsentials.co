import { Heart, ShoppingBag, Minus, Plus, Truck, RefreshCw, Star, Share2 } from 'lucide-react';
import type { Product, Review } from '../../types/product';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  inWishlist: boolean;
  publishedReviews: Review[];
  averageRating: number;
  onAddToCart: () => void;
  onHandleShare: () => void;
  onToggleWishlist: () => void;
  onDecrementQuantity: () => void;
  onIncrementQuantity: () => void;
  onWriteReview: () => void;
  renderStars: (rating: number) => JSX.Element;
}

const ProductInfo = ({
  product,
  quantity,
  inWishlist,
  publishedReviews,
  averageRating,
  onAddToCart,
  onToggleWishlist,
  onHandleShare,
  onDecrementQuantity,
  onIncrementQuantity,
  onWriteReview,
  renderStars
}: ProductInfoProps) => {
  // Format price display
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className="flex flex-col">
      {/* Category & Name */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm mb-2">{product.category.name}</p>
        <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
        
        {/* Ratings summary */}
        {publishedReviews.length > 0 && (
          <div className="flex items-center mt-2">
            {renderStars(Math.round(averageRating))}
            <span className="ml-2 text-sm text-gray-600">
              ({averageRating.toFixed(1)}) · {publishedReviews.length} reviews
            </span>
          </div>
        )}
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
              onClick={onDecrementQuantity}
              className="p-2 border rounded-l-md hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <span className="px-4 py-2 border-t border-b min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              onClick={onIncrementQuantity}
              className="p-2 border rounded-r-md hover:bg-gray-50 transition-colors"
              disabled={product.stockQuantity !== undefined && product.stockQuantity > 0 && quantity >= product.stockQuantity}
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={onAddToCart}
          disabled={!product.inStock}
          className={`flex-1 flex items-center justify-center py-3 px-6 rounded-md font-medium text-white 
            ${product.inStock ? 'bg-primary hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'}
            transition-colors`}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <button
          onClick={onToggleWishlist}
          className={`flex items-center justify-center py-3 px-4 rounded-md border 
            ${inWishlist ? 'border-pink-200 bg-pink-50 text-pink-600' : 'border-gray-300 hover:bg-gray-50'} 
            transition-colors`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? 'fill-pink-600 text-pink-600' : 'text-gray-600'}`} />
        </button>

        <button
            onClick={onHandleShare}
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
    </div>
  );
};

export default ProductInfo;