import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { get, post } from '../../lib/api';
import { FullPageLoader } from '../ui/BrandedLoader';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get('reference');
    
    if (!reference) {
      navigate('/checkout');
      return;
    }
    
    const processPayment = async () => {
      try {
        // 1. Verify the payment
        const verification = await get(`/checkout/verify-payment/${reference}`);
        
        if (verification.verified) {
          // 2. Create an order with the verified payment
          if (cart && cart.cartItems && cart.cartItems.length > 0) {
            try {
              // Get the shipping address from localStorage or session
              const savedShippingAddress = localStorage.getItem('checkoutShippingAddress');
              const shippingAddress = savedShippingAddress ? JSON.parse(savedShippingAddress) : null;
              
              if (!shippingAddress) {
                toast.error('Shipping address not found. Please try again.');
                setStatus('failed');
                return;
              }
              
              const orderData = {
                items: cart.cartItems.map(item => ({
                  productId: item.product.id,
                  quantity: item.quantity
                })),
                shippingAddress,
                paymentMethod: 'PAYSTACK',
                transactionId: reference
              };
              
              const response = await post('/checkout/orders', orderData);
              
              if (response && response.id) {
                setOrderId(response.id);
                setStatus('success');
                
                // Clear cart after successful order
                clearCart();
                
                // Clear saved shipping address
                localStorage.removeItem('checkoutShippingAddress');
              } else {
                throw new Error('Failed to create order');
              }
            } catch (error) {
              console.error('Error creating order:', error);
              toast.error('Payment was successful, but we couldn\'t create your order. Please contact support.');
              setStatus('failed');
            }
          } else {
            toast.error('Your cart is empty. Please add items to your cart and try again.');
            setStatus('failed');
            setTimeout(() => navigate('/shop'), 3000);
          }
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Failed to verify payment. Please try again.');
        setStatus('failed');
      }
    };
    
    processPayment();
  }, [location.search, navigate, cart, clearCart]);
  
  if (status === 'loading') {
    return <FullPageLoader message="Processing your payment..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'success' ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {status === 'success' ? 'Order Confirmed!' : 'Payment Failed'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {status === 'success' 
              ? `Thank you for your purchase${user ? `, ${user.firstName}` : ''}. Your order has been placed successfully.` 
              : 'We were unable to process your payment. Please try again.'}
          </p>
          
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          )}
          
          <div className="flex flex-col space-y-3">
            {status === 'success' ? (
              <>
                <button 
                  onClick={() => navigate('/account/orders')}
                  className="py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  View My Orders
                </button>
                <button 
                  onClick={() => navigate('/shop')}
                  className="py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Contact Support
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;