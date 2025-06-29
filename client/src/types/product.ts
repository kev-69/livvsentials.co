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
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}