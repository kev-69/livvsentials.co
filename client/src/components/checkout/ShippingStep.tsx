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
  const [showAddressForm, setShowAddressForm] = useState(!isAuthenticated || savedAddresses.length === 0);
  
  const handleContinue = () => {
    if (!selectedAddress && !showAddressForm) {
      // Show error - no address selected
      return;
    }
    
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
      
      {/* Saved Addresses (for authenticated users) */}
      {isAuthenticated && savedAddresses.length > 0 && !showAddressForm && (
        <div>
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
                    <p className="text-sm text-gray-600 mt-1">{address.streetName}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.region} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setShowAddressForm(true)}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            + Add a new address
          </button>
        </div>
      )}
      
      {/* Address Form (for new addresses or guest checkout) */}
      {showAddressForm && (
        <AddressForm 
          onSubmit={onAddressCreate}
          onCancel={isAuthenticated && savedAddresses.length > 0 ? () => setShowAddressForm(false) : undefined}
        />
      )}
      
      {/* Continue Button */}
      {!showAddressForm && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedAddress}
            className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingStep;