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
  Search,
  Download,
  PlusCircle,
  Filter,
  Pencil,
  Trash
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Import dashboard components
import TotalRevenue from '@/components/cards/TotalRevenue';
import AvgWeeklyOrders from '@/components/cards/AvgWeeklyOrders';
import TotalCustomers from '@/components/cards/TotalCustomers';
import OrdersTable from '@/components/tables/OrdersTable';
import OrderChart from '@/components/charts/OrderChart';
import ActivityFeed from '@/components/cards/ActivityFeed';
import GuestCustomers from '@/components/cards/GuestCustomers';

// Import order page components
import TotalOrders from '@/components/cards/TotalOrders';
import WeekOrders from '@/components/cards/WeekOrders';
import PendingOrders from '@/components/tables/PendingOrders';
import TopSelling from '@/components/tables/TopSelling';
import PaymentHistory from '@/components/tables/PaymentHistory';
import PendingPayments from '@/components/cards/PendingPayments';
import RefundRate from '@/components/cards/RefundRate';
import CustomersTable from '@/components/tables/CustomersTable';

// imports for the product components
import ProductCard from '@/components/cards/ProductCard';
import ViewProduct from '@/components/modals/ViewProduct';
import EditProduct from '@/components/modals/EditProduct';
import { sampleCategories, sampleProducts } from '@/data/data';
import DeleteProduct from '@/components/modals/DeleteProduct';

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
  const [showViewProductModal, setShowViewProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState(sampleProducts);
  const [categories, setCategories] = useState(sampleCategories);
  const [productTab, setProductTab] = useState('all');

  const handleSaveProduct = (updatedProduct: any) => {
    // For a new product
    if (!updatedProduct.id) {
      const newProduct = {
        ...updatedProduct,
        id: `PROD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      };
      setProducts([...products, newProduct]);
    } else {
      // For updating an existing product
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
    }
    setShowEditProductModal(false);
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setShowDeleteConfirmModal(false);
      setSelectedProduct(null);
    }
  };

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
          {activeContent === 'dashboard' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
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
              
              {/* Top selling products and Activity Feed side by side */}
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
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Orders</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Order Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
                <TotalOrders />
                <WeekOrders />
                <AvgWeeklyOrders />
              </div>

              {/* Order Tabs */}
              <Tabs value={orderTab} onValueChange={setOrderTab} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
                  <OrdersTable />
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  <PendingOrders />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Customers Content - Placeholder */}
          {activeContent === 'customers' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Users Management</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* User Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 mt-6 mb-6">
                <TotalCustomers />
                {/* <CustomerGrowth /> */}
                <GuestCustomers />
              </div>

              {/* User Search and Filter */}
              <div className="mt-6">
                <CustomersTable />
              </div>
            </div>
          )}

          {/* Payments Content - Placeholder */}
          {activeContent === 'payments' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Payments</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Payment Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3 mt-6 mb-6">
                <TotalRevenue />
                <PendingPayments />
                <RefundRate />
              </div>

              {/* Payment History */}
              <div className="mt-6">
                  <PaymentHistory />
              </div>
            </div>
          )}

          {/* Store Settings Content - Placeholder */}
          {activeContent === 'store' && activeSubContent === 'products' && (
            <div className="flex-1 space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight dark:text-white">Products</h1>
                <Button onClick={() => {
                  setSelectedProduct(null);
                  setShowEditProductModal(true);
                }}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <Tabs defaultValue={productTab} onValueChange={setProductTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="in-stock">In Stock</TabsTrigger>
                  <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {/* Search and filter row */}
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full pl-8"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="icon" className="dark:border-gray-700">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Products grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onView={(p) => {
                          setSelectedProduct(p);
                          setShowViewProductModal(true);
                        }}
                        onEdit={(p) => {
                          setSelectedProduct(p);
                          setShowEditProductModal(true);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="in-stock" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.filter(p => p.isAvailable).map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onView={(p) => {
                          setSelectedProduct(p);
                          setShowViewProductModal(true);
                        }}
                        onEdit={(p) => {
                          setSelectedProduct(p);
                          setShowEditProductModal(true);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="out-of-stock" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.filter(p => !p.isAvailable).map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onView={(p) => {
                          setSelectedProduct(p);
                          setShowViewProductModal(true);
                        }}
                        onEdit={(p) => {
                          setSelectedProduct(p);
                          setShowEditProductModal(true);
                        }}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  {/* Categories management UI */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium dark:text-white">Product Categories</h2>
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                  
                  <div className="table-container">
                    <Table>
                      <TableHeader className="table-header">
                        <TableRow className="table-row">
                          <TableHead className="table-header-cell">Name</TableHead>
                          <TableHead className="table-header-cell">Products</TableHead>
                          <TableHead className="table-header-cell">Created</TableHead>
                          <TableHead className="table-header-cell text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map(category => (
                          <TableRow key={category.id} className="table-row">
                            <TableCell className="table-cell font-medium">{category.name}</TableCell>
                            <TableCell className="table-cell">{category.productCount}</TableCell>
                            <TableCell className="table-cell">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="table-cell text-right">
                              <Button variant="ghost" size="icon" className="table-action-button">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 dark:text-red-400 table-action-button">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>

              {/* View Product Modal */}
              <ViewProduct 
                open={showViewProductModal} 
                onOpenChange={setShowViewProductModal}
                product={selectedProduct}
                onEdit={() => {
                  setShowViewProductModal(false);
                  setShowEditProductModal(true);
                }}
                onDelete={() => {
                  setShowViewProductModal(false);
                  setShowDeleteConfirmModal(true);
                }}
              />

              {/* Edit Product Modal */}
              <EditProduct
                open={showEditProductModal} 
                onOpenChange={setShowEditProductModal}
                product={selectedProduct}
                categories={categories}
                onSave={handleSaveProduct}
              />

              {/* Delete Confirmation Modal */}
              <DeleteProduct
                open={showDeleteConfirmModal}
                onOpenChange={setShowDeleteConfirmModal}
                productName={selectedProduct?.name || ""}
                onConfirm={handleDeleteProduct}
              />
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