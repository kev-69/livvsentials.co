import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '../../types/product';

interface FiltersDrawerProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  inStockOnly: boolean;
  setInStockOnly: React.Dispatch<React.SetStateAction<boolean>>;
  onSaleOnly: boolean;
  setOnSaleOnly: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
}

const FiltersDrawer = ({
  visible,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  setInStockOnly,
  onSaleOnly,
  setOnSaleOnly,
  onReset
}: FiltersDrawerProps) => {
  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween' }}
        className="bg-white w-full max-w-xs h-full overflow-auto p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Filters</h1>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategory === category.slug}
                  onChange={() => onCategoryChange(category.slug)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="ml-2">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Min: GHS{priceRange[0]}</span>
              <span className="text-sm text-gray-600">Max: GHS{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[0]}
              onChange={(e) => onPriceRangeChange(e, 0)}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange(e, 1)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Other Filters */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Availability</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="ml-2">In Stock Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={() => setOnSaleOnly(!onSaleOnly)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="ml-2">On Sale</span>
            </label>
          </div>
        </div>
        
        {/* Apply / Reset Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onReset}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FiltersDrawer;