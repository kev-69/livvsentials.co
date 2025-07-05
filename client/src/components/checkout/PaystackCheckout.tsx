import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { get, post } from '../../lib/api';
import { toast } from 'sonner';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackCheckoutProps {
  onPaymentComplete: (transactionId: string) => void;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({ onPaymentComplete }) => {
  const { subtotal, cart } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  
  // Fetch Paystack public key from backend
  useEffect(() => {
    const fetchPaystackKey = async () => {
      try {
        const response = await get('/checkout/paystack-key');
        if (response.publicKey) {
          setPaystackPublicKey(response.publicKey);
        } else {
          toast.error('Could not initialize payment system');
        }
      } catch (error) {
        console.error('Error fetching Paystack key:', error);
        toast.error('Payment system initialization failed');
      }
    };
    
    fetchPaystackKey();
  }, []);
  
  // This will be called when user clicks Pay with Paystack button
  const handlePayWithPaystack = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Calculate total amount including any shipping/tax
      const totalAmount = subtotal;
      
      // Generate metadata with cart details
      const metadata = {
        cart_items: cart?.cartItems?.map(item => ({
          id: item.id,
          product_id: item.product.id,
          quantity: item.quantity
        })) || []
      };
      
      // Initialize payment on the backend
      const response = await post('/checkout/initiate-payment', {
        email,
        amount: totalAmount,
        callbackUrl: `${window.location.origin}/checkout/status`,
        metadata
      });
      
      if (response && response.authorization_url) {
        // Option 1: Redirect to Paystack payment page
        window.location.href = response.authorization_url;
        return;
      } else if (window.PaystackPop && response.reference) {
        // Option 2: Use Paystack popup (if you prefer to stay on your site)
        const handler = window.PaystackPop.setup({
          key: paystackPublicKey,
          email,
          amount: totalAmount * 100, // Convert to kobo
          reference: response.reference,
          onClose: function() {
            setIsProcessing(false);
            toast.info('Payment window closed');
          },
          callback: function(response: any) {
            // Verify payment on the backend
            verifyPayment(response.reference);
          }
        });
        handler.openIframe();
      } else {
        toast.error('Failed to initialize payment. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Verify payment after Paystack callback
  const verifyPayment = async (reference: string) => {
    try {
      const verification = await get(`/checkout/verify-payment/${reference}`);
      
      if (verification.verified) {
        toast.success('Payment successful!');
        onPaymentComplete(reference);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Amount to pay:</span>
          <span className="text-lg font-bold text-gray-900">GHS {subtotal.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Your payment will be processed securely through Paystack.
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          required
        />
      </div>
      
      <button
        onClick={handlePayWithPaystack}
        disabled={isProcessing || !email || !paystackPublicKey}
        className="w-full py-3 px-4 bg-[#0ba4db] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay with Paystack'
        )}
      </button>
      
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" 
              fill="#0ba4db" />
          </svg>
          <span className="text-xs text-gray-600">Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default PaystackCheckout;