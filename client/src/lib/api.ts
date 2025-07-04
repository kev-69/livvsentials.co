import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable cookies for all requests
  withCredentials: true
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
    // For guest cart: check if there's a session ID in the response and store it
    if (response.data && response.data.sessionId && !localStorage.getItem('token')) {
      Cookies.set('cartSessionId', response.data.sessionId, { 
        expires: 30, // 30 days
        path: '/',
        sameSite: 'lax'
      });
    }
    return response;
  },
  (error) => {
    // Check if this is a cart-related path
    const cartPaths = ['/cart', '/checkout', '/orders'];
    const isCartPath = cartPaths.some(path => 
      error.config && error.config.url && error.config.url.includes(path)
    );
    
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Don't redirect for cart/public operations if the user is not logged in
      if (!isCartPath) {
        // Clear token
        localStorage.removeItem('token');
        
        // Redirect to login
        window.location.href = '/auth?redirect=' + window.location.pathname;
      }
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

export const patch = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  const response = await api.patch(url, data, config);
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

// Platform settings specific endpoints
export const platformService = {
  getAppearanceSettings: async () => {
    return await get('/settings/appearance');
  },

  getGalleryImages: async () => {
    return await get('/settings/gallery');
  },
  
  getSEOSettings: async () => {
    return await get('/settings/seo');
  },
  
  getContactInfo: async () => {
    return await get('/settings/contact_info');
  },
};