import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear token
      localStorage.removeItem('token');
      
      // Redirect to login
      window.location.href = '/auth?redirect=' + window.location.pathname;
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Helper functions
export const get = async (url: string, config?: AxiosRequestConfig) => {
  const response = await api.get(url, config);
  return response.data;
};

export const post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.post(url, data, config);
  return response.data;
};

export const put = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.put(url, data, config);
  return response.data;
};

export const del = async (url: string, config?: AxiosRequestConfig) => {
  const response = await api.delete(url, config);
  return response.data;
};