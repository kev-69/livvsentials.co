import { SlidersHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import type { Product } from '../../types/product';
import ProductCard from './ProductCard';
import ProductListCard from './ProductListCard';
import ShimmerEffect from './ShimmerEffect';

interface ProductsGridProps {
  loading: boolean;
  error: string;
  products: Product[];
  viewMode: 'grid' | 'list';
  onAddToWishlist: (id: string) => void;
  onAddToCart: (id: string) => void;
  onResetFilters: () => void;
}

const ProductsGrid = ({
  loading,
  error,
  products,
  viewMode,
  onAddToWishlist,
  onAddToCart,
  onResetFilters
}: ProductsGridProps) => {
  if (loading) {
    return <ShimmerEffect />;
  }
  
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg">
        <SlidersHorizontal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          Reset Filters
        </button>
      </div>
    );
  }
  
  return viewMode === 'grid' ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onAddToWishlist={onAddToWishlist}
            onAddToCart={onAddToCart}
          />
        ))}
      </AnimatePresence>
    </div>
  ) : (
    <div className="space-y-6">
      <AnimatePresence>
        {products.map(product => (
          <ProductListCard 
            key={product.id} 
            product={product}
            onAddToWishlist={onAddToWishlist}
            onAddToCart={onAddToCart}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductsGrid;