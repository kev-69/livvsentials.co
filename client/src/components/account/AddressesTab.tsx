import { useState, useEffect } from 'react';
import { get, post, del } from '../../lib/api';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import type { Address } from '../../types/user';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    streetName: '',
    city: '',
    postalCode: '',
    region: '',
    phone: '',
  });
  
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await get('/addresses');
        // Check if response is an array
        if (Array.isArray(response)) {
          setAddresses(response);
        } else if (response && typeof response === 'object') {
          // If the response is a single address object, wrap it in an array
          if (response.id) {
            setAddresses([response]);
          } else {
            // Handle empty or invalid response
            setAddresses([]);
          }
        } else {
          // If response is neither an array nor an object with id
          setAddresses([]);
        }
      } catch (error) {
        setError('Failed to load addresses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await post('/addresses', formData);
      setAddresses([...addresses, response]);
      setFormData({
        fullName: '',
        streetName: '',
        city: '',
        postalCode: '',
        region: '',
        phone: '',
      });
      setIsAddingAddress(false);
      toast.success('Address added successfully', {
        icon: '✅',
        style: { backgroundColor: '#ECFDF5', color: '#065F46' }
      });
    } catch (error) {
      setError('Failed to add address');
      toast.error('Failed to add address', {
        
      });
      console.error(error);
    }
  };
  
  const handleDeleteAddress = async (id: string) => {
    toast('Are you sure you want to delete this address?', {
      description: 'This action cannot be undone.',
      icon: '⚠️',
      duration: 5000,
        action: {
        label: 'Delete',
        onClick: async () => {
          toast.dismiss();
          await del(`/addresses/${id}`);
          setAddresses(addresses.filter(address => address.id !== id));
        },
      },
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Your Addresses</h1>
        
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            className="flex items-center text-sm font-medium text-primary hover:text-primary-dark"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Address
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isAddingAddress ? (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Add New Address</h3>
          
          <form onSubmit={handleAddAddress}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region/State
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 btn-primary text-white rounded-md hover:bg-opacity-90"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Add an address for faster checkout</p>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="px-4 py-2 btn-primary text-white rounded-md hover:bg-opacity-90"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{address.streetName}</p>
                  <p className="text-gray-600">{address.city}, {address.region}</p>
                  <p className="text-gray-600">{address.postalCode}</p>
                </div>
                
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Delete address"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;