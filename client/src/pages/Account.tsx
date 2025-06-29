import { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react';

// Tab components
import ProfileTab from '../components/account/ProfileTab';
import OrdersTab from '../components/account/OrdersTab';
import AddressesTab from '../components/account/AddressesTab';
import WishlistTab from '../components/account/WishlistTab';

const Account = () => {
  const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth?redirect=/account" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* User info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-3">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                  activeTab === 'profile' 
                    ? 'btn-primary bg-opacity-10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                  activeTab === 'orders' 
                    ? 'btn-primary bg-opacity-10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                  activeTab === 'addresses' 
                    ? 'btn-primary bg-opacity-10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>Addresses</span>
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left ${
                  activeTab === 'wishlist' 
                    ? 'btn-primary bg-opacity-10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'addresses' && <AddressesTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
        </div>
      </div>
    </div>
  );
};

export default Account;