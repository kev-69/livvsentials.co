// Updated Dashboard.tsx with the fix
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  // HelpCircle, 
  Settings,
  Package,
  Star,
  Globe,
  Bell,
  ShoppingCart,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Main tabs
import SettingsTab from '@/components/tabs/Settings';
// import HelpCenterTab from '@/components/tabs/HelpCenter';
import OrdersTab from '@/components/tabs/Orders';
import CustomersTab from '@/components/tabs/Customers';
import PaymentsTab from '@/components/tabs/Payments';
import DashboardTab from '@/components/tabs/Dashboard';

// Sub tabs
import ProductsTab from '@/components/tabs/sub-tabs/Products';
import PlatformSettingsTab from '@/components/tabs/sub-tabs/PlatformSettings';
import NotificationsTab from '@/components/tabs/sub-tabs/Notifications';
import ReviewsTab from '@/components/tabs/sub-tabs/Reviews';

// Content type definition
type ContentType = 'dashboard' | 'orders' | 'customers' | 'payments' | 'store' | 'help' | 'settings';
type SubContentType = 'products' | 'platformSettings' | 'reviews' | 'notifications';

// Logo component
const Logo = ({ size = "normal" }: { size?: "normal" | "small" }) => (
  <div className={`flex items-center ${size === "small" ? "gap-1" : "gap-2"}`}>
    <ShoppingCart 
      className={`text-primary dark:text-primary ${size === "small" ? "h-5 w-5" : "h-6 w-6"}`} 
      strokeWidth={2.5}
    />
    <span 
      className={`font-bold text-primary dark:text-primary ${size === "small" ? "text-base" : "text-xl"}`}
    >
      LIVSSENTIALS
    </span>
  </div>
);

const Dashboard = () => {
  const { admin } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeContent, setActiveContent] = useState<ContentType>('dashboard');
  const [activeSubContent, setActiveSubContent] = useState<SubContentType | null>(null);
  const [orderTab, setOrderTab] = useState('pending');

  // Automatically handle sidebar state based on screen size
  const isSmallScreen = windowWidth < 768; // md breakpoint in Tailwind
  // const sidebarOpen = !isSmallScreen;
  
  // State for store menu (automatically open on larger screens)
  const [storeMenuOpen, setStoreMenuOpen] = useState(!isSmallScreen);

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      // Automatically open store menu on larger screens
      if (newWidth >= 768) {
        setStoreMenuOpen(true);
      } else {
        setStoreMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle store menu click
  const handleStoreClick = () => {
    if (isSmallScreen) {
      setStoreMenuOpen(!storeMenuOpen);
    }
    setActiveContent('store');
  };

  // Function to handle submenu item click
  const handleSubMenuItemClick = (subContent: SubContentType) => {
    setActiveSubContent(subContent);
    setActiveContent('store');
    // Always close the menu on mobile screens
    if (isSmallScreen) {
      setStoreMenuOpen(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${isSmallScreen ? 'w-20' : 'w-64'} dashboard-sidebar transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className={`p-6 flex items-center ${isSmallScreen ? 'justify-center' : 'justify-start'}`}>
          {!isSmallScreen ? (
            <Logo />
          ) : (
            <ShoppingCart className="h-6 w-6 text-primary dark:text-primary" strokeWidth={2.5} />
          )}
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 pt-5 flex flex-col justify-between overflow-y-auto">
          <ul className="px-2 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeContent === 'dashboard'} 
              collapsed={isSmallScreen}
              onClick={() => setActiveContent('dashboard')}
            />
            
            {/* Store Settings with Dropdown */}
           <li>
            <div className="w-full">
              <div 
                className={`
                  flex items-center p-3 rounded-lg transition-colors cursor-pointer
                  text-gray-700 dark:text-gray-300
                  ${activeContent === 'store' ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' : ''}
                  ${isSmallScreen ? 'justify-center' : 'px-4 justify-between'}
                `}
                onClick={handleStoreClick}
              >
                <div className="flex items-center">
                  <span className={activeContent === 'store' ? 'text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'}>
                    <Store size={20} />
                  </span>
                  {!isSmallScreen && <span className="ml-3 font-medium">Store Settings</span>}
                </div>
                {!isSmallScreen && (
                  <span>
                    {storeMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                )}
              </div>
              
              {/* Show submenu conditionally - FIXED: Now checks storeMenuOpen for all screen sizes */}
              {storeMenuOpen && (
                <ul className={`mt-1 space-y-1 ${isSmallScreen ? 'absolute left-20 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-50 w-48' : 'ml-7 border-l-2 border-gray-200 dark:border-dark-300 pl-2'}`}>
                  <SubNavItem 
                    icon={<Package size={18} />} 
                    label="Products" 
                    active={activeContent === 'store' && activeSubContent === 'products'}
                    onClick={() => handleSubMenuItemClick('products')}
                    collapsed={false} // always show text in submenu
                  />
                  <SubNavItem 
                    icon={<Star size={18} />}  
                    label="Platform Settings" 
                    active={activeContent === 'store' && activeSubContent === 'platformSettings'}
                    onClick={() => handleSubMenuItemClick('platformSettings')}
                    collapsed={false}
                  />
                  <SubNavItem 
                    icon={<Globe size={18} />} 
                    label="Reviews" 
                    active={activeContent === 'store' && activeSubContent === 'reviews'}
                    onClick={() => handleSubMenuItemClick('reviews')}
                    collapsed={false}
                  />
                  <SubNavItem 
                    icon={<Bell size={18} />} 
                    label="Notifications" 
                    active={activeContent === 'store' && activeSubContent === 'notifications'}
                    onClick={() => handleSubMenuItemClick('notifications')}
                    collapsed={false}
                  />
                </ul>
              )}
            </div>
          </li>
            
            <NavItem 
              icon={<ShoppingBag size={20} />} 
              label="Orders" 
              active={activeContent === 'orders'}
              collapsed={isSmallScreen}
              onClick={() => {
                setActiveContent('orders');
                setOrderTab('pending');
              }}
            />
            <NavItem 
              icon={<Users size={20} />} 
              label="Customers" 
              active={activeContent === 'customers'}
              collapsed={isSmallScreen}
              onClick={() => setActiveContent('customers')}
            />
            <NavItem 
              icon={<CreditCard size={20} />} 
              label="Payments" 
              active={activeContent === 'payments'}
              collapsed={isSmallScreen}
              onClick={() => setActiveContent('payments')}
            />
          </ul>
          
          {/* Bottom Navigation - Help and Settings */}
          <ul className="px-2 space-y-1 mt-auto mb-6">
            {/* <NavItem 
              icon={<HelpCircle size={20} />} 
              label="Help Center" 
              active={activeContent === 'help'}
              collapsed={isSmallScreen} 
              onClick={() => setActiveContent('help')}
            /> */}
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={activeContent === 'settings'}
              collapsed={isSmallScreen} 
              onClick={() => setActiveContent('settings')}
            />
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="dashboard-header z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {/* Display logo on mobile when sidebar is collapsed */}
              <div className="md:hidden ml-2">
                <Logo size="small" />
              </div>
              
              {/* Welcome text */}
              <h1 className="text-xl font-semibold ml-2 hidden md:inline-block dark:text-gray-100">
                {'Welcome back, ' + (admin?.firstName || 'Admin')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle />
              
              <span className="text-sm font-medium hidden md:block dark:text-gray-300">
                {admin?.email}
              </span>
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?name=${admin?.firstName}+${admin?.lastName}&background=random`} />
                <AvatarFallback>{admin?.firstName?.charAt(0)}{admin?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {/* Dashboard Content */}
          {activeContent === 'dashboard' && <DashboardTab />}

          {/* Store Settings Content */}
          {activeContent === 'store' && activeSubContent === 'products' && <ProductsTab />}
          {activeContent === 'store' && activeSubContent === 'platformSettings' && <PlatformSettingsTab />}
          {activeContent === 'store' && activeSubContent === 'reviews' && <ReviewsTab />}
          {activeContent === 'store' && activeSubContent === 'notifications' && <NotificationsTab />}
          
          {/* If no sub-content is selected yet but store is active, default to products */}
          {activeContent === 'store' && !activeSubContent && (
            <>
              {setActiveSubContent('products')}
              <ProductsTab />
            </>
          )}

          {/* Orders Content */}
          {activeContent === 'orders' && <OrdersTab />}

          {/* Customers Content */}
          {activeContent === 'customers' && <CustomersTab />}

          {/* Payments Content */}
          {activeContent === 'payments' && <PaymentsTab />}

          {/* Help Center Content */}
          {/* {activeContent === 'help' && <HelpCenterTab />} */}

          {/* Settings Content */}
          {activeContent === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active = false, collapsed = false, onClick }: NavItemProps) => (
  <li>
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center p-3 rounded-lg transition-colors 
        ${active 
          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'} 
        ${collapsed ? 'justify-center' : 'px-4'}
      `}
    >
      <span className={active ? 'text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'}>{icon}</span>
      {!collapsed && <span className="ml-3">{label}</span>}
    </button>
  </li>
);

// Sub-navigation item for dropdown
interface SubNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SubNavItem = ({ icon, label, active = false, collapsed = false, onClick }: SubNavItemProps) => (
  <li>
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors 
        ${active 
          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'} 
      `}
    >
      <span className={active ? 'text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'}>{icon}</span>
      {!collapsed && <span className="ml-2">{label}</span>}
    </button>
  </li>
);

export default Dashboard;