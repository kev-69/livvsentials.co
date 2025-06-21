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
  CheckCircle, 
  XCircle, 
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPendingOrders } from "@/lib/api";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner'

// Order interface
interface PendingOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  totalAmount: number;
  status: "PROCESSING";
  items: number;
  payment: {
    status: "PROCESSING" | "COMPLETED";
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "payment_pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "awaiting_fulfillment":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "payment_pending":
      return "Payment Pending";
    case "processing":
      return "Processing";
    case "awaiting_fulfillment":
      return "Awaiting Fulfillment";
    default:
      return status.replace(/_/g, " ");
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

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPendingOrders();
        setPendingOrders(data);
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
        setError("Failed to load pending orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPendingOrders();
  }, []);

  // Filter orders
  const filteredOrders = pendingOrders.filter(order => {
    if (filter === "all") return true;
    if (filter === "payment_pending") return order.payment.status === "PROCESSING";
    if (filter === "processing") return order.payment.status === "COMPLETED";
    return true;
  });

  // Map the order status to UI status
  const mapOrderStatus = (order: PendingOrder) => {
    if (order.payment.status === "PROCESSING") return "payment_pending";
    return "processing";
  };

  const handleApproveOrder = (orderId: string) => {
    // This would call an API to approve the order
    toast.success(`Order ${orderId} has been approved`)
  };

  const handleRejectOrder = (orderId: string) => {
    // This would call an API to reject the order
    toast(`Order ${orderId} has been rejected.`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium dark:text-white">Pending Orders</h2>
            <Select 
              value={filter} 
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pending</SelectItem>
                <SelectItem value="payment_pending">Payment Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
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
            <span className="ml-2">Loading pending orders...</span>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 dark:bg-gray-800 z-10">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No pending orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer.firstName} {order.customer.lastName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(mapOrderStatus(order))}>
                          {getStatusLabel(mapOrderStatus(order))}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Order">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600" 
                            title="Approve"
                            onClick={() => handleApproveOrder(order.orderNumber)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600" 
                            title="Reject"
                            onClick={() => handleRejectOrder(order.orderNumber)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingOrders;