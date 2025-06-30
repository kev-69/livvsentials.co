import { useState, useEffect, useCallback, useContext } from 'react';
import { get, post, del } from '../lib/api';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';

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
    category: {
      id: string;
      name: string;
    }
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchWishlist = useCallback(async () => {
    // Don't try to fetch wishlist if user is not authenticated
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await get('/wishlist');
      setWishlistItems(response);
      setError('');
    } catch (error) {
      setError('Failed to load wishlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Only fetch wishlist if user is authenticated
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  const addToWishlist = useCallback(async (productId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your wishlist', {
        action: {
          label: 'Log In',
          onClick: () => window.location.href = '/auth'
        }
      });
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      // First check if the item is already in the wishlist
      if (isInWishlist(productId)) {
        // Item already exists - show a nicer toast
        toast.info('This item is already in your wishlist', {
          icon: '✨',
          style: { backgroundColor: '#EFF6FF', color: '#1E40AF' }
        });
        return { success: true, alreadyExists: true };
      }

      // Add to wishlist
      await post('/wishlist', { productId });
      
      // Refresh wishlist data
      await fetchWishlist();
      
      toast.success('Item added to wishlist', {
        icon: '❤️',
        style: { backgroundColor: '#FCE7F3', color: '#BE185D' }
      });
      
      return { success: true, alreadyExists: false };
    } catch (error) {
      toast.error('Failed to add item to wishlist');
      console.error(error);
      return { success: false, error };
    }
  }, [fetchWishlist, isAuthenticated, isInWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      await del(`/wishlist/${productId}`);
      
      // Update local state immediately for better UX
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      
      toast.success('Item removed from wishlist', {
        icon: '💔',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      
      return { success: true };
    } catch (error) {
      toast.error('Failed to remove item from wishlist');
      console.error(error);
      return { success: false, error };
    }
  }, [isAuthenticated]);

  const toggleWishlistItem = useCallback(async (productId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please log in to manage your wishlist', {
        action: {
          label: 'Log In',
          onClick: () => window.location.href = '/auth'
        }
      });
      return { success: false, error: 'Not authenticated' };
    }
    
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  }, [isAuthenticated, isInWishlist, removeFromWishlist, addToWishlist]);

  return {
    wishlistItems,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist
  };
};