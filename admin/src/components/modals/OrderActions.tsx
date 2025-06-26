import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  CreditCard,
  Package,
  MapPin,
  ShoppingCart
} from "lucide-react";
import { shipOrder, deliverOrder, cancelOrder } from "@/lib/api";
import { toast } from "sonner";

interface OrderActionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: any;
  onActionComplete: () => void;
}

const OrderActions = ({
  open,
  onOpenChange,
  order,
  onActionComplete,
}: OrderActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<"ship" | "deliver" | "cancel" | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color for badge
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

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "REFUNDED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "PROCESSING":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleAction = async (action: "ship" | "deliver" | "cancel") => {
    setActionType(action);
    setIsLoading(true);

    try {
      let result: any;
      
      switch (action) {
        case "ship":
          result = await shipOrder(order.id);
          toast.success(`${order.user.firstName}'s order - ${order.orderNumber} is being shipped to ${order.shippingAddress}`);
          break;
        case "deliver":
          result = await deliverOrder(order.id);
          toast.success(`${order.user.firstName}'s order - ${order.orderNumber} has been marked as delivered`);
          break;
        case "cancel":
          result = await cancelOrder(order.id);
          toast.success(`${order.user.firstName}'s order - ${order.orderNumber} has been cancelled`);
          break;
      }

      // Notify parent component to refresh the data
      onActionComplete();
      
      // Close the modal
      onOpenChange(false);
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      
      // Extract error message from backend response if available
      let errorMessage = `Failed to ${action} order. Please try again.`;
      
      if (error && typeof error === 'object') {
        // Check for common error message patterns in API responses
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error) {
          errorMessage = typeof error.error === 'string' ? error.error : errorMessage;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>Order {order.orderNumber}</span>
            <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
              {order.orderStatus?.toLowerCase().replace(/_/g, ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-130px)]">
          <div className="p-6 space-y-6">
            {/* Order Actions */}
            {(order.orderStatus === "PROCESSING" || order.orderStatus === "SHIPPED") && (
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Order Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  {order.orderStatus === "PROCESSING" && (
                    <Button 
                      variant="outline" 
                      className="justify-start sm:justify-center"
                      onClick={() => handleAction("ship")}
                      disabled={isLoading}
                    >
                      {isLoading && actionType === "ship" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Truck className="mr-2 h-4 w-4 text-blue-500" />
                      )}
                      Ship Order
                    </Button>
                  )}
                  
                  {(order.orderStatus === "PROCESSING" || order.orderStatus === "SHIPPED") && (
                    <Button 
                      variant="outline" 
                      className="justify-start sm:justify-center"
                      onClick={() => handleAction("deliver")}
                      disabled={isLoading}
                    >
                      {isLoading && actionType === "deliver" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      )}
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {order.orderStatus !== "CANCELLED" && order.orderStatus !== "DELIVERED" && (
                    <Button 
                      variant="outline" 
                      className="justify-start sm:justify-center text-red-500 hover:text-red-600"
                      onClick={() => handleAction("cancel")}
                      disabled={isLoading}
                    >
                      {isLoading && actionType === "cancel" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Cancel Order
                    </Button>
                  )}
                </div>
                
                {order.orderStatus === "DELIVERED" && (
                  <div className="flex items-center p-3 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <p className="text-sm">This order has been delivered and completed.</p>
                  </div>
                )}
                
                {order.orderStatus === "CANCELLED" && (
                  <div className="flex items-center p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <p className="text-sm">This order has been cancelled.</p>
                  </div>
                )}
                
                <Separator />
              </div>
            )}
            
            {/* Order Info */}
            <div className="flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              <span className="text-sm text-muted-foreground">
                Order placed on {formatDate(order.createdAt)}
              </span>
            </div>
            
            {/* Customer Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name:</p>
                  <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-medium">{order.user?.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Shipping Address</h3>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  <p>{order.shippingAddress}</p>
                </div>
              </div>
            )}
            
            {/* Payment Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Payment Information</h3>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                {order.payments && order.payments.length > 0 ? (
                  <>
                    <div className="flex justify-between mb-1">
                      <span>Payment Method:</span>
                      <span className="font-medium">{order.payments[0].paymentMethod || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <Badge variant="outline" className={getPaymentStatusColor(order.payments[0].paymentStatus)}>
                        {order.payments[0].paymentStatus?.toLowerCase().replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p>No payment information available</p>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-3">
                {order.orderItems?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 bg-muted/30 p-3 rounded-lg">
                    {item.product?.productImages && item.product.productImages[0] && (
                      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={typeof item.product.productImages[0] === 'string' 
                            ? item.product.productImages[0].replace(/[\[\]"']/g, '') 
                            : ''}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product?.name}</p>
                      <div className="flex justify-between mt-1 text-sm">
                        <span>Qty: {item.quantity}</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">{formatCurrency(item.quantity * item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex justify-between text-sm py-1">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal || order.totalAmount)}</span>
                </div>
                {order.shippingFee !== undefined && (
                  <div className="flex justify-between text-sm py-1">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm py-1">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderActions;