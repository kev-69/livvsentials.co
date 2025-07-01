import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import type { CustomerDetails, ShippingAddress } from "@/components/tables/CustomersTable";

interface ViewUserOrdersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerDetails | null;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
}

const ViewUserOrders = ({ 
  open, 
  onOpenChange, 
  customer, 
  isLoading,
  formatCurrency
}: ViewUserOrdersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Parse shipping address from JSON string
  const parseShippingAddress = (addressString: string | ShippingAddress): ShippingAddress | null => {
    try {
      // If it's already a ShippingAddress object, return it
      if (typeof addressString !== 'string') {
        return addressString;
      }
      // Otherwise parse the JSON string
      return addressString ? JSON.parse(addressString) : null;
    } catch (error) {
      console.error("Error parsing shipping address:", error);
      return null;
    }
  };
  
  // Status badge component
  const OrderStatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { label: string, className: string }> = {
      'PENDING': { 
        label: 'Pending', 
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200' 
      },
      'PROCESSING': { 
        label: 'Processing', 
        className: 'bg-blue-50 text-blue-700 border-blue-200' 
      },
      'SHIPPED': { 
        label: 'Shipped', 
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
      },
      'DELIVERED': { 
        label: 'Delivered', 
        className: 'bg-green-50 text-green-700 border-green-200' 
      },
      'CANCELLED': { 
        label: 'Cancelled', 
        className: 'bg-red-50 text-red-700 border-red-200' 
      }
    };
    
    const statusInfo = statusMap[status] || { 
      label: status, 
      className: 'bg-gray-50 text-gray-700 border-gray-200' 
    };
    
    return (
      <Badge variant="outline" className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };
  
  // Sort orders
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };
  
  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    if (!customer?.orders) return [];
    
    // Filter orders
    let result = [...customer.orders];
    
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(order => {
        // Search in order number
        if (order.orderNumber.toLowerCase().includes(lowercasedSearch)) {
          return true;
        }
        
        // Search in shipping address
        try {
          const shippingAddress = parseShippingAddress(order.shippingAddress);
          if (shippingAddress) {
            const addressString = `${shippingAddress.fullName} ${shippingAddress.streetName} ${shippingAddress.city} ${shippingAddress.region}`.toLowerCase();
            return addressString.includes(lowercasedSearch);
          }
        } catch (error) {
          // If there's an error parsing, continue with other checks
        }
        
        return false;
      });
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Sort orders
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortConfig.direction === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // Handle dates
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        
        if (sortConfig.direction === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
    });
    
    return result;
  }, [customer, searchTerm, statusFilter, sortConfig]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">Loading customer orders...</p>
          </div>
        ) : !customer ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Customer details not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Orders for {customer.firstName} {customer.lastName}</DialogTitle>
              <DialogDescription>
                View all orders placed by this customer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Orders Table */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] cursor-pointer" onClick={() => handleSort('orderNumber')}>
                        <div className="flex items-center">
                          Order #
                          {sortConfig.key === 'orderNumber' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                        <div className="flex items-center">
                          Date
                          {sortConfig.key === 'createdAt' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('totalAmount')}>
                        <div className="flex items-center">
                          Amount
                          {sortConfig.key === 'totalAmount' && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Shipped To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          {searchTerm || statusFilter !== 'all'
                            ? "No orders match your filters"
                            : "No orders found for this customer"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAndSortedOrders.map((order) => {
                        const shippingAddress = parseShippingAddress(order.shippingAddress);
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.orderStatus} />
                            </TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell className="max-w-[200px] truncate" 
                              title={shippingAddress ? 
                                `${shippingAddress.fullName}, ${shippingAddress.streetName}, ${shippingAddress.city}, ${shippingAddress.region} ${shippingAddress.postalCode}` : 
                                'N/A'
                              }
                            >
                              {shippingAddress ? 
                                `${shippingAddress.fullName}, ${shippingAddress.city}` : 
                                'N/A'
                              }
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserOrders;