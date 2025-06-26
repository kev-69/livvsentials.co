import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, ShoppingBag, User, Loader2 } from "lucide-react";
import type { CustomerDetails } from "@/components/tables/CustomersTable";

interface ViewUserDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerDetails | null;
  isLoading: boolean;
  onViewOrders: () => void;
}

const ViewUserDetails = ({ 
  open, 
  onOpenChange, 
  customer, 
  isLoading,
  onViewOrders
}: ViewUserDetailsProps) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get order status counts
  const getStatusCounts = () => {
    if (!customer?.orders) return { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    
    return customer.orders.reduce((acc, order) => {
      const status = order.orderStatus.toLowerCase();
      acc[status as keyof typeof acc] = (acc[status as keyof typeof acc] || 0) + 1;
      return acc;
    }, { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });
  };
  
  const statusCounts = getStatusCounts();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">Loading customer details...</p>
          </div>
        ) : !customer ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Customer details not found</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                View detailed information about this customer
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Customer Avatar and Name */}
              <div className="flex flex-col items-center justify-center mb-4">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=random&size=100`} />
                  <AvatarFallback>{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{customer.firstName} {customer.lastName}</h3>
              </div>

              {/* Customer Details */}
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {formatDate(customer.createdAt)}</span>
                </div>
                
                {/* Order Summary */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Order Summary
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="py-1">
                      Total: {customer.orders.length}
                    </Badge>
                    
                    {statusCounts.pending > 0 && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending: {statusCounts.pending}
                      </Badge>
                    )}
                    
                    {statusCounts.processing > 0 && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Processing: {statusCounts.processing}
                      </Badge>
                    )}
                    
                    {statusCounts.shipped > 0 && (
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                        Shipped: {statusCounts.shipped}
                      </Badge>
                    )}
                    
                    {statusCounts.delivered > 0 && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Delivered: {statusCounts.delivered}
                      </Badge>
                    )}
                    
                    {statusCounts.cancelled > 0 && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Cancelled: {statusCounts.cancelled}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Last Activity */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Last Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    {customer.orders.length > 0 
                      ? `Last order placed: ${formatDate(customer.orders[0].createdAt)}`
                      : "No orders placed yet"}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {customer.orders.length > 0 && (
                <Button onClick={onViewOrders} className="w-full sm:w-auto">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDetails;