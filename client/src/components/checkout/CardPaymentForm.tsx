import { useState } from 'react';

interface CardPaymentFormProps {
  onSubmit: (details: { cardNumber: string }) => void;
}

const CardPaymentForm = ({ onSubmit }: CardPaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Split into groups of 4 and join with spaces
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    
    return formatted;
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    
    // Clear error when field is changed
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    
    // Clear error when field is changed
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: '' }));
    }
  };
  
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(value);
    
    // Clear error when field is changed
    if (errors.cvc) {
      setErrors(prev => ({ ...prev, cvc: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Simple validation for demo purposes
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    if (!expiryDate.trim() || !expiryDate.includes('/') || expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cvc.trim() || cvc.length !== 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ cardNumber });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number*
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19} // 16 digits + 3 spaces
          className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Name on Card*
        </label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="John Doe"
          className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
            errors.cardName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.cardName && (
          <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date*
          </label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
            CVC*
          </label>
          <input
            type="text"
            id="cvc"
            value={cvc}
            onChange={handleCvcChange}
            placeholder="123"
            maxLength={3}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.cvc ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cvc && (
            <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
};

export default CardPaymentForm;