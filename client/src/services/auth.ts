import { get, post } from '../lib/api';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authService = {
  register: async (userData: RegisterData) => {
    // Remove .data as it's already returned by the post function
    return await post('/auth/register', userData);
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Remove .data as it's already returned by the post function
    return await post('/auth/login', { email, password });
  },

  forgotPassword: async (email: string) => {
    // Remove .data as it's already returned by the post function
    return await post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    // Remove .data as it's already returned by the post function
    return await post('/auth/reset-password', { token, password, confirmPassword });
  },

  getCurrentUser: async () => {
    // Remove .data as it's already returned by the get function
    return await get('/auth/me');
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    // Remove .data as it's already returned by the post function
    return await post('/auth/update-profile', userData);
  }
};