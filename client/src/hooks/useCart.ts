import { useContext, useCallback } from 'react';
import { post, get, del, put } from '../lib/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const useCart = () => {
  const { 
    cart, 
    isLoading, 
    error, 
    totalItems,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    setCart,
    setError,
    setIsLoading
  } = useContext(CartContext);
  
  const { isAuthenticated } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const cartData = await get('/cart');
      
      // Store session ID if returned and user is not authenticated
      if (!isAuthenticated && cartData.sessionId) {
        Cookies.set('cartSessionId', cartData.sessionId, { 
          expires: 30, // 30 days
          path: '/',
          sameSite: 'lax'
        });
      }
      
      setCart(cartData);
      setError('');
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load your cart');
    } finally {
      setIsLoading(false);
    }
  }, [setCart, setError, setIsLoading, isAuthenticated]);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const response = await post('/cart/add', { productId, quantity });
      
      // Store session ID if returned and user is not authenticated
      if (!isAuthenticated && response.sessionId) {
        Cookies.set('cartSessionId', response.sessionId, { 
          expires: 30, // 30 days
          path: '/',
          sameSite: 'lax'
        });
      }
      
      await fetchCart();
      toast.success('Item added to cart', {
        icon: '🛒',
        style: { backgroundColor: '#ECFDF5', color: '#065F46' }
      });
    } catch (error) {
      toast.error('Failed to add item to cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, setIsLoading, isAuthenticated]);

  const toggleAdd = useCallback(async (productId: string, quantity: number = 1) => {
    return addToCart(productId, quantity);
  }, [addToCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }
    
    try {
      setIsLoading(true);
      await put(`/cart/update/${productId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, setIsLoading]);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      await del(`/cart/remove/${productId}`);
      toast.success('Item removed from cart', {
        icon: '🗑️',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      await fetchCart();
    } catch (error) {
      toast.error('Failed to remove item from cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, setIsLoading]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      await del('/cart/clear');
      toast.success('Cart cleared successfully', {
        icon: '🧹',
        style: { backgroundColor: '#F0FDF4', color: '#065F46' }
      });
      await fetchCart();
    } catch (error) {
      toast.error('Failed to clear cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchCart, setIsLoading]);

  return {
    cart,
    isLoading,
    error,
    totalItems,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    toggleAdd
  };
};