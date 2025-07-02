import type { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  cartItems: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}