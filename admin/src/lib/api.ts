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

export const fetchCustomers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const fetchOrderDetails = async (orderId: string) => {
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
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

export const shipOrder = async (orderId: string) => {
  try {
    const response = await api.post(`/admin/order/${orderId}/ship`)
    return response.data.data
  } catch (error) {
    console.error('Error shipping order', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data || error;
    }
    throw error;
  }
}

export const deliverOrder = async (orderId: string) => {
  try {
    const response = await api.post(`/admin/order/${orderId}/deliver`)
    return response.data.data
  } catch (error) {
    console.error('Error delivering order', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data || error;
    }
    throw error;
  }
}

export const cancelOrder = async (orderId: string) => {
  try {
    const response = await api.post(`/admin/order/${orderId}/cancel`)
    return response.data.data
  } catch (error) {
    console.error('Error canceling order', error);
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data || error;
    }
    throw error;
  }
}

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

export const fetchTopSellingProduct = async () => {
  try {
    const response = await api.get('/admin/products/top-seller');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top selling product:', error);
    throw error;
  }
};

export const fetchTopSellingProducts = async () => {
  try {
    const response = await api.get('/admin/products/top-selling');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
}

export const addProduct = async (productData: FormData) => {
  try {
    const response = await api.post('/admin/product', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    return response.data.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export const updateProduct = async (productId: string, productData: FormData) => {
  try {
    const response = await api.patch(`/admin/product/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }  
    });
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

export const fetchOrdersChart = async () => {
  try {
    const response = await api.get('/admin/orders/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw error;
  }
}

export const getTotalOrders = async () => {
  try {
    const response = await api.get('/admin/orders');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching total orders:', error);
    throw error;
  }
};

export const getWeeklyOrdersAvg = async () => {
  try {
    const response = await api.get('/admin/orders/stats/avg-weekly');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching average weekly orders:', error);
    throw error;
  }
};

export const getOrdersThisWeek = async () => {
  try {
    const response = await api.get('/admin/orders/stats/this-week');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching this week orders:', error);
    throw error;
  }
};

export const fetchTotalRevenue = async () => {
  try {
    const response = await api.get('/admin/payments/revenue');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
};

export const fetchProcessingPayments = async () => {
  try {
    const response = await api.get('/admin/payments/processing');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching processing payments:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const response = await api.get('/admin/users/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

export const getGuestCheckouts = async () => {
  try {
    const response = await api.get('/admin/users/guest-checkouts');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching guest checkout statistics:', error);
    throw error;
  }
};

export const getTickets = async () => {
  try {
    const response = await api.get('/admin/help');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching help tickets:', error);
    throw error;
  }
};

export const getTicketById = async (ticketId: string) => {
  try {
    const response = await api.get(`/admin/help/${ticketId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    throw error;
  }
};

export const addMessage = async (ticketId: string, messageData: any) => {
  try {
    const response = await api.post(`/admin/help/${ticketId}/messages`, messageData);
    return response.data.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, statusData: any) => {
  try {
    const response = await api.patch(`/admin/help/${ticketId}/status`, statusData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

export const updateTicketPriority = async (ticketId: string, priorityData: any) => {
  try {
    const response = await api.patch(`/admin/help/${ticketId}/priority`, priorityData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating ticket priority:', error);
    throw error;
  }
};

export const getTicketStats = async () => {
  try {
    const response = await api.get('/admin/help/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    throw error;
  }
};

export const getPlatformSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    throw error;
  }
};

export const getPlatformSetting = async (key: string) => {
  try {
    const response = await api.get(`/admin/settings/${key}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    throw error;
  }
};

export const updatePlatformSetting = async (key: string, value: any) => {
  try {
    const response = await api.patch(`/admin/settings/${key}`, value);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
};

export const fetchReviews = async () => {
  try {
    const response = await api.get('/admin/reviews');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchReviewById = async (reviewId: string) => {
  try {
    const response = await api.get(`/admin/reviews/${reviewId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching review details:', error);
    throw error;
  }
};

export const updateReviewStatus = async (reviewId: string, status: string) => {
  try {
    const response = await api.patch(`/admin/reviews/${reviewId}/status`, { status: status.toUpperCase() });
    return response.data.data;
  } catch (error) {
    console.error('Error updating review status:', error);
    throw error;
  }
};

export const replyToReview = async (reviewId: string, reply: string) => {
  try {
    const response = await api.post(`/admin/reviews/${reviewId}/reply`, { reply });
    return response.data.data;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Questions APIs
export const fetchQuestions = async () => {
  try {
    const response = await api.get('/admin/questions');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const fetchQuestionById = async (questionId: string) => {
  try {
    const response = await api.get(`/admin/questions/${questionId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching question details:', error);
    throw error;
  }
};

export const answerQuestion = async (questionId: string, answer: string) => {
  try {
    const response = await api.post(`/admin/questions/${questionId}/answer`, { answer });
    return response.data.data;
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await api.delete(`/admin/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const fetchReviewStats = async () => {
  try {
    const response = await api.get('/admin/reviews/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    throw error;
  }
};