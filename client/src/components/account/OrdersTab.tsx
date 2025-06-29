import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../lib/api';
import { Clock, Check, TruckIcon, XCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  product: {
    name: string;
    productImages: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  orderItems: OrderItem[];
}

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await get('/orders');
        setOrders(response);
      } catch (error) {
        setError('Failed to load orders');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'SHIPPED':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'DELIVERED':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'Processing';
      case 'SHIPPED':
        return 'Shipped';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link 
          to="/shop" 
          className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between">
              <div>
                <p className="font-medium">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center mt-2 sm:mt-0">
                {getStatusIcon(order.orderStatus)}
                <span className="ml-2 text-sm font-medium">
                  {getStatusText(order.orderStatus)}
                </span>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                      {item.product.productImages.length > 0 ? (
                        <img
                          src={item.product.productImages[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × GHS {item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">GHS {(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-medium">GHS {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-right">
              <Link
                to={`/order/${order.id}`}
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                View Order Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;