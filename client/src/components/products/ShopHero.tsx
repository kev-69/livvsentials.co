import { Search } from 'lucide-react';
import type { RefObject } from 'react';

interface ShopHeroProps {
  searchInputRef: RefObject<HTMLInputElement>;
  defaultSearchValue: string;
  onSearch: (e: React.FormEvent) => void;
}

const ShopHero = ({ searchInputRef, defaultSearchValue, onSearch }: ShopHeroProps) => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Collection</h1>
          <p className="text-lg text-gray-300 mb-6">
            Discover our curated selection of high-quality products designed for modern living.
          </p>
          
          {/* Search Form */}
          <form onSubmit={onSearch} className="flex w-full max-w-md">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              defaultValue={defaultSearchValue}
              className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-primary text-gray-900"
            />
            <button 
              type="submit" 
              className="bg-primary hover:bg-opacity-90 px-4 py-3 rounded-r-lg text-white flex items-center"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 -top-20 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ShopHero;