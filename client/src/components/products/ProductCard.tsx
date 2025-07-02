import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types/product';
import { useWishlist } from '../../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  onAddToWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const ProductCard = ({ product, onAddToWishlist, onAddToCart }: ProductCardProps) => {
  const { isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img 
            src={product.productImages[0] || 'https://placehold.co/600x600/png?text=No+Image'} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-2xl font-semibold px-2 py-1 rounded custom">
            Sale
          </div>
        )}
        
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onAddToWishlist(product.id)} 
            className={`rounded-full p-2 shadow-md hover:bg-gray-100 mb-2 ${inWishlist ? 'bg-pink-100' : 'bg-white'}`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'text-pink-500 fill-pink-500' : 'text-gray-700'}`} />
          </button>
        </div>
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-white bg-opacity-90 text-gray-800 font-medium px-3 py-1 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="text-sm text-gray-500 mb-2">
          {product.category.name}
        </div>
        
        <div className="flex items-center justify-between">
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
          
          {product.inStock && (
            <button 
              onClick={() => onAddToCart(product.id)}
              className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;