import { useState } from 'react';
import PaystackCheckout from './PaystackCheckout'; // We'll create this component

interface PaymentMethod {
  type: 'PAYSTACK';
}

interface PaymentStepProps {
  onPaymentSelect: (method: PaymentMethod) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const PaymentStep = ({
  onPaymentSelect,
  onPrevious,
  onNext,
}: PaymentStepProps) => {
  const [paymentType, setPaymentType] = useState<'PAYSTACK'>();

  const handlePaystackPayment = () => {
    onPaymentSelect({
      type: 'PAYSTACK',
    });
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
      
      {/* Payment Options */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setPaymentType('PAYSTACK')}
            className={`p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center transition-colors ${
              paymentType === 'PAYSTACK'
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mb-2 h-6 w-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6 4.8H5.4C3.52 4.8 2 6.32 2 8.2V15.8C2 17.68 3.52 19.2 5.4 19.2H18.6C20.48 19.2 22 17.68 22 15.8V8.2C22 6.32 20.48 4.8 18.6 4.8Z" 
                  fill={paymentType === 'PAYSTACK' ? '#3BB75E' : '#D1D5DB'} />
              </svg>
            </div>
            <span className={`text-sm font-medium ${paymentType === 'PAYSTACK' ? 'text-primary' : 'text-gray-700'}`}>
              Paystack
            </span>
          </div>
        </div>
      </div>
      
      {/* Payment Form based on selected type */}
      <div className="mb-6">
        {paymentType === 'PAYSTACK' && (
          <PaystackCheckout onPaymentComplete={handlePaystackPayment} />
        )}
      </div>
      
      {/* Back Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;