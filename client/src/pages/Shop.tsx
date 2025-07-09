import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { get } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { AuthContext } from '../context/AuthContext';
import { FullPageLoader } from '../components/ui/BrandedLoader';

// Import types
import type { Product, Category } from '../types/product';

// Import components
import ShopHero from '../components/products/ShopHero';
import FiltersBar from '../components/products/FiltersBar';
import FiltersDrawer from '../components/products/FiltersDrawer';
import ProductsGrid from '../components/products/ProductsGrid';
import Pagination from '../components/products/Pagination';
import { toast, Toaster } from 'sonner';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlistItem } = useWishlist();
  const { isAuthenticated } = useContext(AuthContext);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;
  
  // Filters and View State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await get('/products');
        setProducts(productsResponse);
        
        // Fetch categories
        const categoriesResponse = await get('/categories');
        setCategories(categoriesResponse);
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error('Error fetching shop data:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100); // Simulate loading delay
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters to products
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Filter by category
      if (selectedCategory) {
        filtered = filtered.filter(product => 
          product.category.slug === selectedCategory || product.category.id === selectedCategory
        );
      }
      
      // Filter by price range
      filtered = filtered.filter(product => {
        const priceToCheck = product.salePrice ?? product.price;
        return priceToCheck >= priceRange[0] && priceToCheck <= priceRange[1];
      });
      
      // Filter by stock status
      if (inStockOnly) {
        filtered = filtered.filter(product => product.inStock);
      }
      
      // Filter by sale status
      if (onSaleOnly) {
        filtered = filtered.filter(product => product.salePrice !== null);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'price-low-high':
          filtered.sort((a, b) => {
            const priceA = a.salePrice ?? a.price;
            const priceB = b.salePrice ?? b.price;
            return priceA - priceB;
          });
          break;
        case 'price-high-low':
          filtered.sort((a, b) => {
            const priceA = a.salePrice ?? a.price;
            const priceB = b.salePrice ?? b.price;
            return priceB - priceA;
          });
          break;
        case 'name-a-z':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-z-a':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'newest':
        default:
          // Assuming products are already sorted by newest in the API
          break;
      }
      
      setFilteredProducts(filtered);
      
      // Calculate total pages
      setTotalPages(Math.ceil(filtered.length / productsPerPage));
      
      // Reset to first page when filters change
      setCurrentPage(1);
      
      // Update URL params
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (sortBy !== 'newest') params.set('sort', sortBy);
      if (searchQuery) params.set('q', searchQuery);
      if (inStockOnly) params.set('inStock', 'true');
      if (onSaleOnly) params.set('onSale', 'true');
      
      setSearchParams(params, { replace: true });
    }
  }, [products, selectedCategory, priceRange, sortBy, searchQuery, inStockOnly, onSaleOnly, setSearchParams]);
  
  // Handle category filter
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? '' : categorySlug);
  };
  
  // Handle price range filter
  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(event.target.value);
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value);
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your wishlist', {
        icon: '🔒',
        style: { backgroundColor: '#FEE2E2', color: '#B91'},
        action: {
          label: 'Log In',
          onClick: () => window.location.href = '/auth'
        }
      });
      return;
    }
    
    try {
      await toggleWishlistItem(productId);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error(error);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('newest');
    setSearchQuery('');
    setInStockOnly(false);
    setOnSaleOnly(false);
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };
  
  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  if (isLoading) {
    return <FullPageLoader animation="wave" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster position='top-center'/>
      <ShopHero
        searchInputRef={searchInputRef}
        defaultSearchValue={searchQuery}
        onSearch={handleSearch}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sorting Bar */}
        <FiltersBar
          onOpenFilters={() => setFiltersVisible(true)}
          selectedCategory={selectedCategory}
          categories={categories}
          onClearCategory={() => setSelectedCategory('')}
          inStockOnly={inStockOnly}
          onClearInStock={() => setInStockOnly(false)}
          onSaleOnly={onSaleOnly}
          onClearOnSale={() => setOnSaleOnly(false)}
          hasActiveFilters={!!(selectedCategory || inStockOnly || onSaleOnly || searchQuery)}
          onResetFilters={resetFilters}
          sortBy={sortBy}
          onSortChange={(value) => setSortBy(value)}
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />
        
        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          <FiltersDrawer
            visible={filtersVisible}
            onClose={() => setFiltersVisible(false)}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onSaleOnly={onSaleOnly}
            setOnSaleOnly={setOnSaleOnly}
            onReset={resetFilters}
          />
        </AnimatePresence>
        
        {/* Products Grid / List */}
        <div className="mb-6">
          <ProductsGrid
            loading={loading}
            error={error}
            products={getCurrentPageProducts()}
            viewMode={viewMode}
            onAddToWishlist={handleAddToWishlist}
            onAddToCart={handleAddToCart}
            onResetFilters={resetFilters}
          />
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default Shop;