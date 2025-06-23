// import { useState } from "react";
// import PrintInvoiceModal from "./PrintInvoiceModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Package, Truck, CheckCircle2, XCircle, ShoppingCart, MapPin } from "lucide-react";

interface OrderPayment {
  id: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string | null;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    productImages: string[];
  };
}

interface ViewOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    orderNumber: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    orderStatus: string;
    shippingAddress: string | null;
    payments: OrderPayment[];
    orderItems: OrderItem[];
    discount?: number;
    shippingFee?: number;
    subtotal?: number;
  };
}

const ViewOrder = ({ open, onOpenChange, order }: ViewOrderProps) => {
    // const [printModalOpen, setPrintModalOpen] = useState(false);
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
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Order Details: {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center gap-2">
              {getStatusIcon(order.orderStatus)}
              <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                {order.orderStatus?.toLowerCase().replace(/_/g, ' ')}
              </Badge>
              <span className="text-sm text-muted-foreground ml-2">
                {formatDate(order.createdAt)}
              </span>
            </div>
            
            {/* Customer Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name:</p>
                  <p className="font-medium">{order?.user?.firstName} {order?.user?.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone Number:</p>
                  <p className="font-medium">{order?.user?.phone}</p>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            {order?.shippingAddress && (
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
                    {order?.payments && order.payments.length > 0 ? (
                    <>
                        <div className="flex justify-between mb-1">
                            <span>Payment Method:</span>
                            <span className="font-medium">{order.payments[0].paymentMethod || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between mt-2 mb-2">
                            <span>Payment Status:</span>
                            <Badge variant="outline" className={getPaymentStatusColor(order.payments[0].paymentStatus)}>
                                {order.payments[0].paymentStatus?.toLowerCase().replace(/_/g, ' ')}
                            </Badge>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Payment Amount:</span>
                            <span className="font-medium">{formatCurrency(order.payments[0].amount)}</span>
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
                {order?.orderItems?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 bg-muted/30 p-3 rounded-lg">
                    {item.product?.productImages && item.product.productImages[0] && (
                      <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={typeof item.product.productImages[0] === 'string' 
                            ? item.product.productImages[0].replace(/[\[\]"']/g, '') 
                            : ''}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
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
                  <span>{formatCurrency(order?.subtotal || order?.totalAmount)}</span>
                </div>
                {order?.shippingFee !== undefined && (
                  <div className="flex justify-between text-sm py-1">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(order?.totalAmount)}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {/* <Button variant="default" onClick={() => setPrintModalOpen(true)}>
                Print Invoice
              </Button> */}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
        {/* Print Invoice Modal */}
        {/* {printModalOpen && (
        <PrintInvoiceModal
            open={printModalOpen}
            onOpenChange={setPrintModalOpen}
            order={order}
        />
        )} */}
    </Dialog>
  );
};

export default ViewOrder;