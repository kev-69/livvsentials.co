export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  reply: string | null;
  status: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  description: string;
  stockQuantity: number;
  inStock: boolean;
  productImages: string[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  reviews: Review[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    productImages: string[];
    category: {
      id: string;
      name: string;
    }
  };
}