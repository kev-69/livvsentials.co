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
  ChevronDown,
  ChevronRight,
  Package,
  Star,
  Globe,
  Bell,
  // Truck,
  // Percent,
  // Palette,
  Search,
  // Filter,
  Download,
  // PlusCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Import dashboard components
import TotalRevenue from '@/components/cards/TotalRevenue';
import AvgWeeklyOrders from '@/components/cards/AvgWeeklyOrders';
import TotalCustomers from '@/components/cards/TotalCustomers';
import OrdersTable from '@/components/tables/OrdersTable';
import OrderChart from '@/components/charts/OrderChart';
import ActivityFeed from '@/components/cards/ActivityFeed';

// Import order page components
import TotalOrders from '@/components/cards/TotalOrders';
import WeekOrders from '@/components/cards/WeekOrders';
import PendingOrders from '@/components/tables/PendingOrders';
import TopSelling from '@/components/tables/TopSelling';
import PaymentHistory from '@/components/tables/PaymentHistory';
import PendingPayments from '@/components/cards/PendingPayments';
import RefundRate from '@/components/cards/RefundRate';
import CustomersTable from '@/components/tables/CustomersTable';
// import CustomerGrowth from '@/components/cards/CustomerGrowth';
import GuestCustomers from '@/components/cards/GuestCustomers';

// Content type definition
type ContentType = 'dashboard' | 'orders' | 'customers' | 'payments' | 'store';
type SubContentType = 'products' | 'platformSettings' | 'reviews' | 'notifications';

const Dashboard = () => {
  const { admin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<ContentType>('dashboard');
  const [activeSubContent, setActiveSubContent] = useState<SubContentType | null>(null);
  const [orderTab, setOrderTab] = useState('pending');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} dashboard-sidebar transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className={`p-6 flex items-center justify-center ${!sidebarOpen && 'justify-center'}`}>
          <h1 className={`text-xl font-bold text-primary dark:text-primary ${!sidebarOpen && 'hidden'}`}>LIVVSENTIALS</h1>
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
              <button
                onClick={() => {
                  if (sidebarOpen) {
                    setStoreMenuOpen(!storeMenuOpen);
                  }
                  // setActiveContent('store');
                  // setActiveSubContent('products'); // Default to products when store is clicked
                }}
                className={`
                  w-full flex items-center p-3 rounded-lg transition-colors 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200
                  ${activeContent === 'store' ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' : ''}
                  ${!sidebarOpen ? 'justify-center' : 'px-4 justify-between'}
                `}
              >
                <div className="flex items-center">
                  <span className={activeContent === 'store' ? 'text-primary dark:text-primary' : 'text-gray-500 dark:text-gray-400'}>
                    <Store size={20} />
                  </span>
                  {sidebarOpen && <span className="ml-3">Store Settings</span>}
                </div>
                {sidebarOpen && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {storeMenuOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>
              
              {/* Dropdown Menu */}
              {sidebarOpen && storeMenuOpen && (
                <ul className="mt-1 ml-7 space-y-1 border-l-2 border-gray-200 dark:border-dark-300 pl-2">
                  <SubNavItem 
                    icon={<Package size={18} />} 
                    label="Products" 
                    active={activeSubContent === 'products'}
                    onClick={() => {
                      setActiveSubContent('products');
                      setActiveContent('store');
                    }}
                  />
                  <SubNavItem 
                    icon={<Star size={18} />}  
                    label="Platform Settings" 
                    active={activeSubContent === 'platformSettings'}
                    onClick={() => setActiveSubContent('platformSettings')}
                  />
                  <SubNavItem 
                    icon={<Globe size={18} />} 
                    label="Reviews" 
                    active={activeSubContent === 'reviews'}
                    onClick={() => setActiveSubContent('reviews')}
                  />
                  <SubNavItem 
                    icon={<Bell size={18} />} 
                    label="Notifications" 
                    active={activeSubContent === 'notifications'}
                    onClick={() => setActiveSubContent('notifications')}
                  />
                  {/* <SubNavItem icon={<Percent size={18} />} label="Discounts" />
                  <SubNavItem icon={<Palette size={18} />} label="Store Design" /> */}
                </ul>
              )}
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
              collapsed={!sidebarOpen} 
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              collapsed={!sidebarOpen} 
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
                {activeContent === 'dashboard' && 'Welcome back, ' + (admin?.firstName || 'Admin')}
                {activeContent === 'orders' && 'Order Management'}
                {activeContent === 'customers' && 'Customer Management'}
                {activeContent === 'payments' && 'Payment History'}
                {activeContent === 'store' && 'Store Settings'}
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
          {activeContent === 'dashboard' && (
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Overview</h1>
              </div>
              {/* Dashboard Metrics */}
              <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
                <TotalRevenue />
                <AvgWeeklyOrders />
                <TotalCustomers />
              </div>
              
              {/* Order Chart */}
              <div className="mb-6 dashboard-card rounded-lg" style={{ height: "350px" }}>
                <OrderChart />
              </div>
              
              {/* Orders Table and Activity Feed side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
                {/* Recent Orders - Takes 2/3 of the width */}
                <div className="lg:col-span-2">
                  <TopSelling />
                </div>
                
                {/* Activity Feed - Takes 1/3 of the width */}
                <div>
                  <ActivityFeed />
                </div>
              </div>
            </div>
          )}

          {/* Orders Content */}
          {activeContent === 'orders' && (
            <div className="flex-1 space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Orders</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Order Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <TotalOrders />
                <WeekOrders />
                <AvgWeeklyOrders />
              </div>

              {/* Order Tabs */}
              <Tabs value={orderTab} onValueChange={setOrderTab} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <TabsList>
                    <TabsTrigger value="pending">
                      Pending
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        7
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                  </TabsList>
                  <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search orders..."
                        className="w-full pl-8"
                      />
                    </div>
                    {/* <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button> */}
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="p-6">
                      <h2 className="text-lg font-medium mb-4 dark:text-white">All Orders</h2>
                      <OrdersTable />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="p-6">
                      <h2 className="text-lg font-medium mb-4 dark:text-white">Pending Orders</h2>
                      <PendingOrders />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Customers Content - Placeholder */}
          {activeContent === 'customers' && (
            <div className="flex-1 space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Users Management</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* User Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <TotalCustomers />
                {/* <CustomerGrowth /> */}
                <GuestCustomers />
              </div>

              {/* User Search and Filter */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <h2 className="text-lg font-medium dark:text-white">Customer List</h2>
                <div className="flex w-full sm:w-auto gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search customers..."
                      className="w-full pl-8"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="recent">Recent Customers</SelectItem>
                      <SelectItem value="active">Active Customers</SelectItem>
                      <SelectItem value="inactive">Inactive Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>  

              {/* User Management Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                  <CustomersTable />
                </div>
              </div>
            </div>
          )}

          {/* Payments Content - Placeholder */}
          {activeContent === 'payments' && (
            <div className="flex-1 space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Payments</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Payment Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <TotalRevenue />
                <PendingPayments />
                <RefundRate />
              </div>

              {/* Payment History */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium dark:text-white">Payment History</h2>
                  <div className="flex w-full sm:w-auto gap-2 max-w-xs ml-auto">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search payments..."
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="p-6">
                    <PaymentHistory />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings Content - Placeholder */}
          {activeContent === 'store' && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6 dark:text-white">Store Settings</h1>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <p className="text-gray-500 dark:text-gray-400">Store configuration settings will go here.</p>
              </div>
            </div>
          )}
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