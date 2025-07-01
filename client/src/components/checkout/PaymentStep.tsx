import { useState } from 'react';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import CardPaymentForm from './CardPaymentForm';
import MobileMoneyForm from './MobileMoneyForm';

interface PaymentMethod {
  type: 'CARD' | 'MOBILE_MONEY' | 'CASH_ON_DELIVERY';
  details: {
    cardNumber?: string;
    mobileNumber?: string;
    provider?: string;
  };
}

interface PaymentStepProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentSelect: (method: PaymentMethod) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const PaymentStep = ({
  selectedPaymentMethod,
  onPaymentSelect,
  onPrevious,
  onNext,
}: PaymentStepProps) => {
  const [paymentType, setPaymentType] = useState<'CARD' | 'MOBILE_MONEY' | 'CASH_ON_DELIVERY'>(
    selectedPaymentMethod?.type || 'CARD'
  );
  
  const handleCardPaymentSubmit = (details: { cardNumber: string }) => {
    onPaymentSelect({
      type: 'CARD',
      details: {
        cardNumber: details.cardNumber,
      },
    });
    onNext();
  };
  
  const handleMobileMoneySubmit = (details: { mobileNumber: string; provider: string }) => {
    onPaymentSelect({
      type: 'MOBILE_MONEY',
      details: {
        mobileNumber: details.mobileNumber,
        provider: details.provider,
      },
    });
    onNext();
  };
  
  const handleCashOnDeliverySelect = () => {
    onPaymentSelect({
      type: 'CASH_ON_DELIVERY',
      details: {},
    });
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
      
      {/* Payment Options */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setPaymentType('CARD')}
            className={`p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center transition-colors ${
              paymentType === 'CARD'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className={`mb-2 ${paymentType === 'CARD' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${paymentType === 'CARD' ? 'text-primary' : 'text-gray-700'}`}>
              Credit/Debit Card
            </span>
          </div>
          
          <div
            onClick={() => setPaymentType('MOBILE_MONEY')}
            className={`p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center transition-colors ${
              paymentType === 'MOBILE_MONEY'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className={`mb-2 ${paymentType === 'MOBILE_MONEY' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${paymentType === 'MOBILE_MONEY' ? 'text-primary' : 'text-gray-700'}`}>
              Mobile Money
            </span>
          </div>
          
          <div
            onClick={() => setPaymentType('CASH_ON_DELIVERY')}
            className={`p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center transition-colors ${
              paymentType === 'CASH_ON_DELIVERY'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className={`mb-2 ${paymentType === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${paymentType === 'CASH_ON_DELIVERY' ? 'text-primary' : 'text-gray-700'}`}>
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
      
      {/* Payment Form based on selected type */}
      <div className="mb-6">
        {paymentType === 'CARD' && (
          <CardPaymentForm onSubmit={handleCardPaymentSubmit} />
        )}
        
        {paymentType === 'MOBILE_MONEY' && (
          <MobileMoneyForm onSubmit={handleMobileMoneySubmit} />
        )}
        
        {paymentType === 'CASH_ON_DELIVERY' && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700 mb-4">
              You will pay when your order is delivered. Please have the exact amount ready.
            </p>
            
            <button
              type="button"
              onClick={handleCashOnDeliverySelect}
              className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              Continue with Cash on Delivery
            </button>
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to Shipping
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;