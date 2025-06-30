import React, { createContext, useState, useEffect, useContext } from 'react';
import { get, post, put, del } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/product';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

// Types adjusted to match backend
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  transferGuestCart: () => Promise<void>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  error: null,
  totalItems: 0,
  subtotal: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  transferGuestCart: async () => {},
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  setCart: () => {},
  setIsLoading: (isLoading: boolean) => {},
  setError: (error: string) => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Calculate derived values from cart data
  const totalItems = cart?.itemCount || 0;
  const subtotal = cart?.subtotal || 0;

  // Fetch cart items
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Pass the cartSessionId as a query parameter for guest users
      const cartSessionId = !isAuthenticated ? Cookies.get('cartSessionId') : null;
      const config = cartSessionId ? { params: { sessionId: cartSessionId } } : undefined;
      
      const response = await get('/cart', config);
      setCart(response);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load your cart. Please try again.');
      
      // Initialize an empty cart on error
      setCart({
        id: '',
        cartItems: [],
        subtotal: 0,
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);
  
  // Transfer guest cart to user cart after login
  useEffect(() => {
    if (isAuthenticated && user) {
      transferGuestCart();
    }
  }, [isAuthenticated, user]);

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Include session ID for guest users
      const cartSessionId = !isAuthenticated ? Cookies.get('cartSessionId') : null;
      const data = { productId, quantity };
      if (cartSessionId) {
        Object.assign(data, { sessionId: cartSessionId });
      }
      
      await post('/cart/add', data);
      await fetchCart();
      
      toast.success('Item added to cart successfully', {
        icon: '🛒',
        style: { backgroundColor: '#ECFDF5', color: '#065F46' }
      });
      
      // Optionally open cart drawer
      // setIsCartOpen(true);
    } catch (error) {
      toast.error('Failed to add item to cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Include session ID for guest users
      const cartSessionId = !isAuthenticated ? Cookies.get('cartSessionId') : null;
      const config = cartSessionId ? { params: { sessionId: cartSessionId } } : undefined;
      
      await del(`/cart/remove/${productId}`, config);
      await fetchCart();
      
      toast.success('Item removed from cart successfully', {
        icon: '🗑️',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
    } catch (error) {
      toast.error('Failed to remove item from cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      setError('Failed to remove item from cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      
      // Include session ID for guest users
      const cartSessionId = !isAuthenticated ? Cookies.get('cartSessionId') : null;
      const data = { quantity };
      if (cartSessionId) {
        Object.assign(data, { sessionId: cartSessionId });
      }
      
      await put(`/cart/update/${productId}`, data);
      await fetchCart();
    } catch (error) {
      toast.error('Failed to update cart item quantity', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      setError('Failed to update cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Include session ID for guest users
      const cartSessionId = !isAuthenticated ? Cookies.get('cartSessionId') : null;
      const config = cartSessionId ? { params: { sessionId: cartSessionId } } : undefined;
      
      await del('/cart/clear', config);
      await fetchCart();
      
      toast.success('Cart cleared successfully', {
        icon: '🧹',
        style: { backgroundColor: '#ECFDF5', color: '#065F46' }
      });
    } catch (error) {
      toast.error('Failed to clear cart', {
        icon: '❌',
        style: { backgroundColor: '#FEE2E2', color: '#991B1B' }
      });
      setError('Failed to clear cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Transfer guest cart to user cart
  const transferGuestCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const cartSessionId = Cookies.get('cartSessionId');
      if (cartSessionId) {
        await post('/cart/transfer', { sessionId: cartSessionId });
        
        // Clear the session cookie after transferring cart
        Cookies.remove('cartSessionId', { path: '/' });
      }
      
      await fetchCart();
    } catch (error) {
      console.error('Error transferring cart:', error);
      // Don't show error to user, just try to fetch cart again
      await fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  // Cart drawer controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        transferGuestCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        setCart,
        setIsLoading,
        setError
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using the cart context
export const useCart = () => useContext(CartContext);