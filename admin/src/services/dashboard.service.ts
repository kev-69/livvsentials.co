import apiClient from '@/lib/api';

export const fetchDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

export const fetchRecentOrders = async (limit = 5) => {
  const response = await apiClient.get(`/orders/recent?limit=${limit}`);
  return response.data;
};

export const fetchProductInventory = async () => {
  const response = await apiClient.get('/products/inventory');
  return response.data;
};