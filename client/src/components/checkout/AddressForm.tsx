import { useState } from 'react';
import type { Address } from '../../types/user';

interface AddressFormProps {
  initialAddress?: Address;
  onSubmit: (address: Address) => void;
  onCancel?: () => void;
}

const AddressForm = ({ initialAddress, onSubmit, onCancel }: AddressFormProps) => {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      fullName: '',
      phone: '',
      streetName: '',
      city: '',
      region: '',
      postalCode: '',
    }
  );
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!address.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!address.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!address.streetName?.trim()) {
      newErrors.streetName = 'Street address is required';
    }
    
    if (!address.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!address.region?.trim()) {
      newErrors.region = 'Region/State is required';
    }
    
    if (!address.postalCode?.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(address);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="col-span-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name*
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        {/* Phone */}
        <div className="col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        {/* Street Address */}
        <div className="col-span-2">
          <label htmlFor="streetName" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address*
          </label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={address.streetName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.streetName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.streetName && (
            <p className="mt-1 text-sm text-red-600">{errors.streetName}</p>
          )}
        </div>
        
        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City*
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        {/* Region/State */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
            Region/State*
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={address.region}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.region ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region}</p>
          )}
        </div>
        
        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code*
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={address.postalCode}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-primary focus:border-primary ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          {onCancel ? 'Save Address' : 'Continue to Payment'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;