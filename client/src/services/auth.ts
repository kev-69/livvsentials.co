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
  };
}

export const authService = {
  register: async (userData: RegisterData) => {
    const response = await post('/auth/register', userData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await post('/auth/login', { email, password });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    const response = await post('/auth/reset-password', { token, password, confirmPassword });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    const response = await post('/auth/update-profile', userData);
    return response.data;
  }
};