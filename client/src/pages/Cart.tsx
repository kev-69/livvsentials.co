import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, AlertCircle, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'sonner';
import { FullPageLoader } from '../components/ui/BrandedLoader';

const Cart = () => {
  const { 
    cart, 
    isLoading, 
    error, 
    totalItems, 
    subtotal, 
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);

  // Handle coupon code application
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    // Simulate coupon API call
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'WELCOME10') {
        setDiscount(subtotal * 0.1);
      } else {
        setCouponError('Invalid or expired coupon code');
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };
  
  // Calculate the final total
  const total = subtotal - discount;
  
  // Calculate estimated delivery date (7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return <FullPageLoader animation="wave" />;
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <Link to="/shop" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-md inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </button>
          </div>
        ) : !cart || cart.cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-xl mx-auto">
            <div className="bg-gray-100 p-6 inline-flex rounded-full mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-500" />
            </div>
            <h1 className="text-xl font-semibold mb-3">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
              Browse our products and find something you'll love!
            </p>
            <Link
              to="/shop"
              className="bg-primary text-white px-6 py-3 rounded-md inline-block font-medium hover:bg-opacity-90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 gap-8">
            {/* Cart Items (Left Side) */}
            <div className="lg:col-span-8 mb-8 lg:mb-0">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Cart Header */}
                <div className="border-b px-6 py-4 hidden md:flex text-sm text-gray-500">
                  <div className="w-2/5">Product</div>
                  <div className="w-1/5 text-center">Price</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-right">Total</div>
                </div>
                
                {/* Cart Items */}
                <div className="divide-y">
                  {cart.cartItems.map((item) => (
                    <motion.div 
                      key={item.productId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-4 py-4 md:px-6 md:py-6 flex flex-col md:flex-row md:items-center"
                    >
                      {/* Product Info */}
                      <div className="flex md:w-2/5 mb-4 md:mb-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={item.product.productImages[0] || 'https://placehold.co/200x200/png?text=No+Image'} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <Link
                            to={`/products/${item.product.slug}`}
                            className="text-gray-900 font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.productName}
                          </Link>
                          
                          <div className="text-sm text-gray-500 mt-1">
                            {item.product.category.name}
                          </div>
                          
                          {!item.product.inStock && (
                            <div className="text-red-500 text-sm mt-1">Out of stock</div>
                          )}
                          
                          {/* Mobile Price */}
                          <div className="flex justify-between items-center mt-2 md:hidden">
                            <div className="text-gray-900 font-medium">
                              GHS {item.price.toFixed(2)}
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price - Desktop */}
                      <div className="hidden md:block md:w-1/5 text-center">
                        {item.product.salePrice ? (
                          <div>
                            <span className="text-primary font-medium">
                              GHS {item.product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-gray-400 line-through text-sm ml-2">
                              GHS {item.product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-medium">
                            GHS {item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="md:w-1/5 flex justify-center">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`px-3 py-1 ${
                              item.quantity <= 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-gray-700'
                            }`}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center border-x py-1 text-gray-900"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={!item.product.inStock || item.quantity >= item.product.stockQuantity}
                            className={`px-3 py-1 ${
                              !item.product.inStock || item.quantity >= item.product.stockQuantity
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-500 hover:text-gray-700'
                            }`}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total & Remove - Desktop */}
                      <div className="hidden md:flex md:w-1/5 justify-end items-center">
                        <span className="text-gray-900 font-medium">
                          GHS {item.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Cart Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </button>
                  <Link
                    to="/shop"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary (Right Side) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                <div className="px-6 py-4 border-b">
                  <h1 className="font-semibold text-lg text-gray-900">Order Summary</h1>
                </div>
                
                <div className="p-6">
                  {/* Coupon Code */}
                  <form onSubmit={handleApplyCoupon} className="mb-6">
                    <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 min-w-0 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingCoupon}
                        className={`bg-gray-100 border border-gray-300 border-l-0 rounded-r-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 ${
                          isApplyingCoupon ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-sm text-red-600">{couponError}</p>
                    )}
                    {discount > 0 && (
                      <p className="mt-2 text-sm text-green-600">Coupon applied successfully!</p>
                    )}
                  </form>
                  
                  {/* Price Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">GHS {subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (WELCOME10)</span>
                        <span>-GHS {discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3 flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>GHS {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link
                    to={isAuthenticated ? "/checkout" : "/auth?redirect=/checkout"}
                    className="mt-6 block w-full bg-primary text-white rounded-md py-3 px-4 text-center font-medium hover:bg-opacity-90 transition-colors"
                  >
                    {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
                  </Link>
                  
                  {/* Guest Checkout Option */}
                  {!isAuthenticated && (
                    <Link
                      to="/checkout?guest=true"
                      className="mt-2 block w-full bg-white border border-gray-300 text-gray-700 rounded-md py-3 px-4 text-center font-medium hover:bg-gray-50 transition-colors"
                    >
                      Continue as Guest
                    </Link>
                  )}
                  
                  {/* Shipping Info */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Free shipping on orders over GHS 500
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Estimated delivery: {formattedDeliveryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accepted Payment Methods */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-2">We accept:</p>
                    <div className="flex space-x-2">
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                      <div className="h-6 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;