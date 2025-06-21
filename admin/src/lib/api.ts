import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const API_URL = 'http://localhost:5000/api';

// Get the JWT token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

// Configure axios with auth headers
export const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// export const login = async (email: string, password: string) => {
//     try {
//         const response = await api.post('/admin/login', { email, password });
//         console.log('Login response:', response.data);
//     } catch (error) {
//         console.error('Login error:', error);
//         throw error;   
//     }
// }

export const fetchCustomers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api.get('/admin/orders');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const fetchPendingOrders = async () => {
  try {
    const response = await api.get('/admin/orders/pending');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    throw error;
  }
};

export const fetchPayments = async () => {
  try {
    const response = await api.get('/admin/payments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await api.get('/admin/products');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export const fetchProductById = async (productId: string) => {
  try {
    const response = await api.get(`/admin/product/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export const fetchProductBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/admin/product/slug/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
}

export const fetchTopSellingProducts = async () => {
  try {
    const response = await api.get('/admin/products/top-selling');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
}

export const addProduct = async (productData: any) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export const updateProduct = async (productId: string, productData: any) => {
  try {
    const response = await api.patch(`/admin/product/${productId}`, productData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    const response = await api.delete(`/admin/product/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export const fetchCategories = async () => {
  try {
    const response = await api.get('/admin/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (categoryData: any) => {
  try {
    const response = await api.post('/admin/categories', categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

export const updateCategory = async (categoryId: string, categoryData: any) => {
  try {
    const response = await api.patch(`/admin/category/${categoryId}`, categoryData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await api.delete(`/admin/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
