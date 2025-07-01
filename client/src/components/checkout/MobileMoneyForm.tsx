import { useState } from 'react';

interface MobileMoneyFormProps {
  onSubmit: (details: { mobileNumber: string; provider: string }) => void;
}

const MobileMoneyForm = ({ onSubmit }: MobileMoneyFormProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [provider, setProvider] = useState('mtn');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobileNumber(value);
    
    // Clear error when field is changed
    if (errors.mobileNumber) {
      setErrors(prev => ({ ...prev, mobileNumber: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ mobileNumber, provider });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Money Provider*
        </label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
        >
          <option value="mtn">MTN Mobile Money</option>
          <option value="vodafone">Vodafone Cash</option>
          <option value="airteltigo">AirtelTigo Money</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number*
        </label>
        <input
          type="tel"
          id="mobileNumber"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
          placeholder="0XXXXXXXXX"
          maxLength={10}
          className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
            errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.mobileNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 rounded-md mt-4">
        <p className="text-sm text-gray-700">
          After placing your order, you will receive a prompt on your mobile phone to complete the payment.
        </p>
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

export default MobileMoneyForm;