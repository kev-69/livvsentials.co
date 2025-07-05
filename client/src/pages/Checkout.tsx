import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { toast, Toaster } from 'sonner';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import ReviewStep from '../components/checkout/ReviewStep';
import OrderSummary from '../components/checkout/OrderSummary';
import StepTransition from '../components/checkout/StepTransition';
import { get, post } from '../lib/api';
import type { Address } from '../types/user';

// Define the types
interface PaymentMethod {
  type: 'PAYSTACK';
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  
  // Fetch saved addresses if user is authenticated
  useEffect(() => {
    const fetchAddresses = async () => {
      if (isAuthenticated && user) {
        try {
          const addresses = await get('/addresses');
          setSavedAddresses(addresses);
          
          // If user has a default address, select it
          const defaultAddress = addresses.find((addr: any) => addr.isDefault);
          if (defaultAddress) {
            setShippingAddress(defaultAddress);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
          toast.error('Failed to load saved addresses');
        }
      }
    };
    
    fetchAddresses();
  }, [isAuthenticated, user]);
  
  // Check if cart is empty
  useEffect(() => {
    if (cart?.cartItems?.length === 0 && !orderComplete) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [cart?.cartItems, navigate, orderComplete]);
  
  // Handle step changes with transitions
  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    
    // Set the transition message based on which step we're moving to
    let message = '';
    if (nextStep === 2) {
      message = 'Preparing your order review...';
    } else if (nextStep === 3) {
      message = 'Setting up payment options...';
      
      // Save shipping address to localStorage when moving to payment step
      if (shippingAddress) {
        localStorage.setItem('checkoutShippingAddress', JSON.stringify(shippingAddress));
      }
    }
    
    setTransitionMessage(message);
    setIsTransitioning(true);
  };
  
  const completeTransition = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
    setIsTransitioning(false);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Handle shipping address selection/creation
  const handleAddressSelect = (address: Address) => {
    setShippingAddress(address);
  };
  
  const handleAddressCreate = async (address: Address) => {
    try {
      if (isAuthenticated) {
        // Save address to the backend for authenticated users
        const savedAddress = await post('/addresses', address);
        setSavedAddresses(prev => [...prev, savedAddress]);
        setShippingAddress(savedAddress);
      } else {
        // Just use the address for the current checkout
        setShippingAddress(address);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };
  
  // Check for Paystack callback
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get('reference');
    const paystackStatus = queryParams.get('status');
    
    if (reference && paystackStatus) {
      // Clear the query parameters
      window.history.replaceState(null, '', window.location.pathname);
      
      if (paystackStatus === 'success') {
        // Verify the payment with our backend
        const verifyPayment = async () => {
          try {
            setIsLoading(true);
            const verification = await get(`/checkout/verify-payment/${reference}`);
            
            if (verification.verified) {
              // Set payment method for the order
              setPaymentMethod({
                type: 'PAYSTACK',
              });
              
              // Create the order with the payment reference
              handlePlaceOrder();
            } else {
              toast.error('Payment verification failed. Please try again.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Failed to verify payment');
          } finally {
            setIsLoading(false);
          }
        };
        
        verifyPayment();
      } else {
        toast.error('Payment was cancelled or failed');
      }
    }
  }, []);

  // Also update handlePaymentSelect to handle Paystack:
  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    // If it's Paystack and we have a reference, proceed to create order
    if (method.type === 'PAYSTACK') {
      handlePlaceOrder();
    }
  };
  
  
  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod || !cart) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
        items: cart.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };
      
      const response = await post('/orders', orderData);
      
      setOrderComplete(true);
      setOrderId(response.id);
      
      // Clear the cart after successful order
      clearCart();
      
      toast.success('Your order has been placed successfully!');
      
      // In a real application, you might redirect to a payment gateway
      // or to an order confirmation page
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render order confirmation
  if (orderComplete && orderId) {
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
              <p className="text-sm text-gray-500 mt-1">Order #{orderId}</p>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                We've sent a confirmation email to {user?.email || 'your email address'} with your order details.
              </p>
              <p className="text-gray-700">
                You can also view your order status in the <a href="/account" className="text-primary hover:underline">My Account</a> section.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Guard against null cart
  if (!cart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your cart...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <Toaster position="top-center" />
      
      {/* Step Transition Loader */}
      <StepTransition 
        loading={isTransitioning} 
        onComplete={completeTransition}
        message={transitionMessage}
      />
      
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        {/* Checkout Steps */}
        <CheckoutSteps currentStep={currentStep} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <ShippingStep
                  savedAddresses={savedAddresses}
                  selectedAddress={shippingAddress}
                  isAuthenticated={isAuthenticated}
                  onAddressSelect={handleAddressSelect}
                  onAddressCreate={handleAddressCreate}
                  onNext={goToNextStep}
                />
              )}
              
              {/* Step 2: Review */}
              {currentStep === 2 && (
                <ReviewStep
                  cart={cart}
                  shippingAddress={shippingAddress}
                  isLoading={isLoading}
                  onPrevious={goToPreviousStep}
                  onNext={goToNextStep}
                />
              )}
              
              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <PaymentStep
                  onPaymentSelect={handlePaymentSelect}
                  onPrevious={goToPreviousStep}
                  onNext={handlePlaceOrder}
                />
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              cart={cart}
              totalItems={subtotal}
              estimatedShipping={0} // You can calculate this based on address
              estimatedTax={0} // You can calculate this based on total
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;