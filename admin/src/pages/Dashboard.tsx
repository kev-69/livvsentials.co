import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  HelpCircle, 
  Settings,
  Menu,
  X,
  Package,
  Star,
  Globe,
  Bell,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// tabs
import SettingsTab from '@/components/tabs/Settings';
import HelpCenterTab from '@/components/tabs/HelpCenter';
import OrdersTab from '@/components/tabs/Orders';
import CustomersTab from '@/components/tabs/Customers';
import PaymentsTab from '@/components/tabs/Payments';
import DashboardTab from '@/components/tabs/Dashboard';
import ProductsTab from '@/components/tabs/sub-tabs/Products';

// Content type definition
type ContentType = 'dashboard' | 'orders' | 'customers' | 'payments' | 'store' | 'help' | 'settings';
type SubContentType = 'products' | 'platformSettings' | 'reviews' | 'notifications';

const Dashboard = () => {
  const { admin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState<ContentType>('dashboard');
  const [activeSubContent, setActiveSubContent] = useState<SubContentType | null>(null);
  const [orderTab, setOrderTab] = useState('pending');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} dashboard-sidebar transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className={`p-6 flex items-center justify-center ${!sidebarOpen && 'justify-center'}`}>
          <h1 className={`text-xl font-bold text-primary dark:text-primary ${!sidebarOpen && 'hidden'}`}>LIVSSENTIALS</h1>
          {/* Toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 mr-2 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 pt-5 flex flex-col justify-between overflow-y-auto">
          <ul className="px-2 space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              active={activeContent === 'dashboard'} 
              collapsed={!sidebarOpen}
              onClick={() => setActiveContent('dashboard')}
            />
            
            {/* Store Settings with Dropdown */}
           <li>
            <div className="w-full">
              <div 
                className={`
                  flex items-center p-3 rounded-lg transition-colors 
                  text-gray-700 dark:text-gray-300
                  ${activeContent === 'store' ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' : ''}
                  ${!sidebarOpen ? 'justify-center' : 'px-4 justify-between'}
                `}
              >
                <div className="flex items-center">
                  <span className={activeContent === 'store' ? 'text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'}>
                    <Store size={20} />
                  </span>
                  {sidebarOpen && <span className="ml-3 font-medium">Store Settings</span>}
                </div>
              </div>
              
              {/* Always visible sub-menu */}
              {sidebarOpen && (
                <ul className="mt-1 ml-7 space-y-1 border-l-2 border-gray-200 dark:border-dark-300 pl-2">
                  <SubNavItem 
                    icon={<Package size={18} />} 
                    label="Products" 
                    active={activeContent === 'store' && activeSubContent === 'products'}
                    onClick={() => {
                      setActiveSubContent('products');
                      setActiveContent('store');
                    }}
                  />
                  <SubNavItem 
                    icon={<Star size={18} />}  
                    label="Platform Settings" 
                    active={activeContent === 'store' && activeSubContent === 'platformSettings'}
                    onClick={() => {
                      setActiveSubContent('platformSettings');
                      setActiveContent('store');
                    }}
                  />
                  <SubNavItem 
                    icon={<Globe size={18} />} 
                    label="Reviews" 
                    active={activeContent === 'store' && activeSubContent === 'reviews'}
                    onClick={() => {
                      setActiveSubContent('reviews');
                      setActiveContent('store');
                    }}
                  />
                  <SubNavItem 
                    icon={<Bell size={18} />} 
                    label="Notifications" 
                    active={activeContent === 'store' && activeSubContent === 'notifications'}
                    onClick={() => {
                      setActiveSubContent('notifications');
                      setActiveContent('store');
                    }}
                  />
                </ul>
              )}
            </div>
          </li>
            
            <NavItem 
              icon={<ShoppingBag size={20} />} 
              label="Orders" 
              active={activeContent === 'orders'}
              collapsed={!sidebarOpen}
              onClick={() => {
                setActiveContent('orders');
                setOrderTab('pending');
              }}
            />
            <NavItem 
              icon={<Users size={20} />} 
              label="Customers" 
              active={activeContent === 'customers'}
              collapsed={!sidebarOpen}
              onClick={() => setActiveContent('customers')}
            />
            <NavItem 
              icon={<CreditCard size={20} />} 
              label="Payments" 
              active={activeContent === 'payments'}
              collapsed={!sidebarOpen}
              onClick={() => setActiveContent('payments')}
            />
          </ul>
          
          {/* Bottom Navigation - Help and Settings */}
          <ul className="px-2 space-y-1 mt-auto mb-6">
            <NavItem 
              icon={<HelpCircle size={20} />} 
              label="Help Center" 
              active={activeContent === 'help'}
              collapsed={!sidebarOpen} 
              onClick={() => setActiveContent('help')}
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={activeContent === 'settings'}
              collapsed={!sidebarOpen} 
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
            <div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={20} />
              </Button>
              <h1 className="text-xl font-semibold ml-2 inline-block dark:text-gray-100">
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

          {/* Store Settings Content - Placeholder */}
          {activeContent === 'store' && activeSubContent === 'products' && <ProductsTab />}

          {/* Orders Content */}
          {activeContent === 'orders' && <OrdersTab />}

          {/* Customers Content - Placeholder */}
          {activeContent === 'customers' && <CustomersTab />}

          {/* Payments Content - Placeholder */}
          {activeContent === 'payments' && <PaymentsTab />}

          {/* Help Center Content */}
          {activeContent === 'help' && <HelpCenterTab />}

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
  onClick?: () => void;
}

const SubNavItem = ({ icon, label, active = false, onClick }: SubNavItemProps) => (
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
      <span className="ml-2">{label}</span>
    </button>
  </li>
);

export default Dashboard;