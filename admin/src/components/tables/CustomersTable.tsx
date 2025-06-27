import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, Loader2, User, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { fetchCustomers, fetchCustomerById } from "@/lib/api";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ViewUserDetails from "@/components/modals/ViewUserDetails";
import ViewUserOrders from "@/components/modals/ViewUserOrders";
import { toast } from "sonner";

// Customer type definition
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  orders: {
    count: number;
    totalSpent: number;
  };
  createdAt: string;
}

export interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  orders: CustomerOrder[]
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  guestCheckout: boolean;
  orderItems: [];
  payments: [];
  createdAt: string;
  updatedAt: string;
}

const CustomersTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // State for modals
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isUserOrdersOpen, setIsUserOrdersOpen] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Load customer details when selected
  useEffect(() => {
    const loadCustomerDetails = async () => {
      if (!selectedCustomerId) return;
      
      try {
        setIsLoadingCustomer(true);
        const data = await fetchCustomerById(selectedCustomerId);
        setSelectedCustomer(data);
      } catch (err) {
        console.error("Failed to fetch customer details:", err);
        toast.error("Failed to load customer details. Please try again.");
        setSelectedCustomerId(null);
      } finally {
        setIsLoadingCustomer(false);
      }
    };

    loadCustomerDetails();
  }, [selectedCustomerId]);

  // Filter and search customers
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch = 
      searchTerm === "" || 
      fullName.includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case "recent":
        // Customers joined in the last 30 days
        return new Date(customer.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      case "active":
        // Customers with at least one order
        return customer.orders.count > 0;
      case "inactive":
        // Customers with no orders
        return customer.orders.count === 0;
      default:
        return true;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return `GHS ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Handle viewing customer details
  const handleViewCustomerDetails = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsUserDetailsOpen(true);
  };

  // Handle viewing customer orders
  const handleViewCustomerOrders = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsUserOrdersOpen(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-lg font-medium dark:text-white">Customer List</h2>
              <div className="flex w-full sm:w-auto gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <Select 
                  value={filter} 
                  onValueChange={(value) => {
                    setFilter(value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                >
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-[250px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading customers...</span>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader className="sticky top-0 dark:bg-gray-800 z-10">
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=random`} />
                              <AvatarFallback>{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{customer.firstName} {customer.lastName}</span>
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.orders.count}</TableCell>
                          <TableCell>
                            {customer.orders.count > 0 
                              ? formatCurrency(customer.orders.totalSpent) 
                              : "No orders yet"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewCustomerDetails(customer.id)}>
                                  <User className="h-4 w-4 mr-2" />
                                  View profile
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleViewCustomerOrders(customer.id)}
                                  disabled={customer.orders.count === 0}
                                >
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                  View orders
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent className="flex flex-wrap justify-center gap-1">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {/* Responsive pagination that shows limited page numbers on mobile */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // On mobile, only show current page and 1 page before/after
                      const pageNum = i + 1;
                      const showOnMobile = 
                        pageNum === 1 || 
                        pageNum === totalPages || 
                        Math.abs(pageNum - currentPage) <= 1;
                      
                      // Add ellipsis for gaps in pagination
                      if (!showOnMobile && (pageNum === currentPage - 2 || pageNum === currentPage + 2)) {
                        return (
                          <PaginationItem key={`ellipsis-${i}`} className="hidden sm:block">
                            <span className="px-2">...</span>
                          </PaginationItem>
                        );
                      }
                      
                      if (!showOnMobile) {
                        return (
                          <PaginationItem key={i} className="hidden sm:block">
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <ViewUserDetails
        open={isUserDetailsOpen}
        onOpenChange={setIsUserDetailsOpen}
        customer={selectedCustomer}
        isLoading={isLoadingCustomer}
        onViewOrders={() => {
          setIsUserDetailsOpen(false);
          setIsUserOrdersOpen(true);
        }}
      />

      {/* User Orders Modal */}
      <ViewUserOrders
        open={isUserOrdersOpen}
        onOpenChange={setIsUserOrdersOpen}
        customer={selectedCustomer}
        isLoading={isLoadingCustomer}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default CustomersTable;