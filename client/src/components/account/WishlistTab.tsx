import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get, del } from '../../lib/api';
import { Trash2, ShoppingCart } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    productImages: string[];
  };
}

const WishlistTab = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await get('/wishlist');
      setWishlistItems(response);
    } catch (error) {
      setError('Failed to load wishlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWishlist();
  }, []);
  
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // Pass the product ID to the API endpoint as that's what your backend expects
      await del(`/wishlist/${productId}`);
      
      // Filter using the wishlist item's ID (not the product ID)
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      
      // Show success toast
      toast.success('Item removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
      console.error(error);
    }
  };
  
  const handleAddToCart = async (productId: string) => {
    try {
      await get(`/cart/add/${productId}`);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error(error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }
  
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Save items you love for later.</p>
        <Link 
          to="/shop" 
          className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <Toaster position="top-center" />
      <h2 className="text-xl font-semibold mb-6">Your Wishlist</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {item.product.productImages && item.product.productImages.length > 0 ? (
                <img
                  src={item.product.productImages[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              <button
                onClick={() => handleRemoveFromWishlist(item.productId)}
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-gray-100"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4">
              <Link 
                to={`/products/${item.product.slug}`}
                className="font-medium hover:text-primary line-clamp-1"
              >
                {item.product.name}
              </Link>
              
              <div className="mt-1 flex items-center">
                {item.product.salePrice ? (
                  <>
                    <span className="font-medium text-primary">
                      ${item.product.salePrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-medium">${item.product.price.toFixed(2)}</span>
                )}
              </div>
              
              <button
                onClick={() => handleAddToCart(item.product.id)}
                className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTab;