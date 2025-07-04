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
import { 
  // MoreHorizontal,
  Loader2,
  Search,
  AlertCircle,
  Eye,
  // Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchOrders, fetchOrderDetails } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PrintInvoiceModal from "@/components/modals/PrintInvoiceModal";
import ViewOrder from "@/components/modals/ViewOrder";
import { toast } from "sonner";

// Order interface
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: number;
  payment: {
    status: "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (amount: number) => {
  return `GHS ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [viewOrderOpen, setViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const itemsPerPage = 10;
  const [printInvoiceOpen, setPrintInvoiceOpen] = useState(false);
  const [orderForInvoice, setOrderForInvoice] = useState<any>(null);


  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleViewOrder = async (orderId: string) => {
    try {
      setLoadingOrderDetails(true);
      const orderDetails = await fetchOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setViewOrderOpen(true);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // const handlePrintInvoice = async (orderId: string) => {
  //   try {
  //     setLoadingOrderDetails(true);
  //     const orderDetails = await fetchOrderDetails(orderId);
  //     setOrderForInvoice(orderDetails);
  //     setPrintInvoiceOpen(true);
  //   } catch (err) {
  //     console.error("Failed to fetch order details for invoice:", err);
  //     toast.error("Failed to load order details for invoice. Please try again.");
  //   } finally {
  //     setLoadingOrderDetails(false);
  //   }
  // };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
    const matchesSearch = 
      searchTerm === "" || 
      customerName.includes(searchTerm.toLowerCase()) || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "date-asc") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "amount-desc") {
      return b.totalAmount - a.totalAmount;
    } else if (sortBy === "amount-asc") {
      return a.totalAmount - b.totalAmount;
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-lg font-medium dark:text-white">All Orders</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => {
                      setStatusFilter(value);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={sortBy} 
                    onValueChange={(value) => {
                      setSortBy(value);
                    }}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="amount-desc">Highest Amount</SelectItem>
                      <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <span className="ml-2">Loading orders...</span>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto max-h-[400px]">
                <Table>
                  <TableHeader className="sticky top-0 dark:bg-gray-800 z-10">
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>{order.customer.firstName} {order.customer.lastName}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                              {order.status.toLowerCase().replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleViewOrder(order.id)}>
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
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

      {/* View Order Modal */}
      {selectedOrder && (
        <ViewOrder 
          open={viewOrderOpen} 
          onOpenChange={setViewOrderOpen} 
          order={selectedOrder}
        />
      )}

      {/* Loading Overlay for Order Details */}
      {loadingOrderDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg flex items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading order details...</span>
          </div>
        </div>
      )}

      {/* Print Invoice Modal */}
      {orderForInvoice && (
        <PrintInvoiceModal
          open={printInvoiceOpen}
          onOpenChange={setPrintInvoiceOpen}
          order={orderForInvoice}
        />
      )}
    </>
  );
};

export default OrdersTable;