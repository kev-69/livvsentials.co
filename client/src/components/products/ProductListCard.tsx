import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types/product';
import { useWishlist } from '../../hooks/useWishlist';

interface ProductListCardProps {
  product: Product;
  onAddToWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductListCard = ({ product, onAddToWishlist, onAddToCart }: ProductListCardProps) => {
  const { isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex"
    >
      <div className="relative w-36 sm:w-48 overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img 
            src={product.productImages[0] || 'https://placehold.co/600x600/png?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xl font-semibold px-2 py-1 rounded custom">
            Sale
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-white bg-opacity-90 text-gray-800 font-medium px-3 py-1 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1">
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="text-sm text-gray-500 mb-2">
            {product.category.name}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="font-semibold text-primary">GHS {product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">GHS {product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-semibold">GHS {product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => onAddToWishlist(product.id)} 
              className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${inWishlist ? 'bg-pink-100' : 'bg-gray-100'}`}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'text-pink-500 fill-pink-500' : 'text-gray-700'}`} />
            </button>
            
            {product.inStock && (
              <button 
                onClick={() => onAddToCart(product.id)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full bg-primary text-white hover:bg-opacity-90 transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm font-medium">Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListCard;