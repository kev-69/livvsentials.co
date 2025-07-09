import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartDrawer = () => {
  const { 
    cart, 
    isLoading, 
    error, 
    totalItems,
    subtotal, 
    isCartOpen, 
    closeCart,
    removeFromCart,
    updateQuantity
  } = useCart();

  // Prevent body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeCart}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                <h1 className="font-medium text-lg">Your Cart</h1>
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto py-4 px-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 px-4">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button 
                    onClick={closeCart}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : !cart || cart.cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 p-6 inline-flex rounded-full mb-4">
                    <ShoppingCart className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item) => (
                    <div key={item.productId} className="flex border-b pb-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.product.productImages[0] || 'https://placehold.co/200x200/png?text=No+Image'} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.productName}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-500 mt-1">
                          {item.product.category.name}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-primary font-medium">
                            GHS {item.price.toFixed(2)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-1 text-sm min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cart && cart.cartItems.length > 0 && (
              <div className="border-t p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">GHS {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">GHS {subtotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="py-2 px-4 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="py-2 px-4 text-center bg-primary text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center"
                  >
                    Checkout <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;