export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  orderStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  product: {
    name: string;
    productImages: string[];
  };
  quantity: number;
  price: number;
}