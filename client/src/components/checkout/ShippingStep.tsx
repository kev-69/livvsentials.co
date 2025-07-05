import { useState } from 'react';
import AddressForm from './AddressForm';
import type { Address } from '../../types/user';

interface ShippingStepProps {
  savedAddresses: Address[];
  selectedAddress: Address | null;
  isAuthenticated: boolean;
  onAddressSelect: (address: Address) => void;
  onAddressCreate: (address: Address) => void;
  onNext: () => void;
}

const ShippingStep = ({
  savedAddresses,
  selectedAddress,
  isAuthenticated,
  onAddressSelect,
  onAddressCreate,
  onNext,
}: ShippingStepProps) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const handleContinue = () => {
    if (!selectedAddress) {
      // Show error - no address selected
      return;
    }
    
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
      
      {/* Saved Addresses section - always visible now */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {savedAddresses.length > 0 ? 'Select a shipping address' : 'No saved addresses'}
        </h3>
        
        {savedAddresses.length > 0 && (
          <div className="space-y-4 mb-4">
            {savedAddresses.map((address) => (
              <div 
                key={address.id} 
                onClick={() => onAddressSelect(address)}
                className={`p-4 border rounded-md cursor-pointer ${
                  selectedAddress?.id === address.id 
                    ? 'border-primary bg-primary bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress?.id === address.id}
                    onChange={() => onAddressSelect(address)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <p className="font-medium">{address.fullName}</p>
                    <p className="text-sm mt-1">{address.streetName}</p>
                    <p className="text-sm">
                      {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p className="text-sm mt-1">{address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setShowAddressForm(true)}
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          + Add a new address
        </button>
      </div>
      
      {/* Address Form (conditionally shown) */}
      {showAddressForm && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Add new address</h3>
          <AddressForm 
            onSubmit={(address) => {
              onAddressCreate(address);
              setShowAddressForm(false);
            }}
            onCancel={() => setShowAddressForm(false)}
          />
        </div>
      )}
      
      {/* Continue Button - only show when not adding a new address */}
      {!showAddressForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedAddress}
            className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingStep;