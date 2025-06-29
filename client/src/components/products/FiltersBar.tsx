import { Sliders, X, ChevronDown, Grid, List } from 'lucide-react';
import type { Category } from '../../types/product';

interface FiltersBarProps {
  onOpenFilters: () => void;
  selectedCategory: string;
  categories: Category[];
  onClearCategory: () => void;
  inStockOnly: boolean;
  onClearInStock: () => void;
  onSaleOnly: boolean;
  onClearOnSale: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FiltersBar = ({
  onOpenFilters,
  selectedCategory,
  categories,
  onClearCategory,
  inStockOnly,
  onClearInStock,
  onSaleOnly,
  onClearOnSale,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: FiltersBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center">
        <button 
          onClick={onOpenFilters}
          className="mr-4 flex items-center text-gray-700 hover:text-primary"
        >
          <Sliders className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        
        {/* Selected Category Pill */}
        {selectedCategory && (
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <span>{categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)?.name}</span>
            <button 
              onClick={onClearCategory}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {/* Other active filters */}
        {inStockOnly && (
          <div className="ml-2 flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <span>In Stock</span>
            <button 
              onClick={onClearInStock}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {onSaleOnly && (
          <div className="ml-2 flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <span>On Sale</span>
            <button 
              onClick={onClearOnSale}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {/* Reset Filters */}
        {hasActiveFilters && (
          <button 
            onClick={onResetFilters}
            className="ml-3 text-sm text-primary hover:text-primary-dark"
          >
            Reset All
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-50 rounded-md p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;