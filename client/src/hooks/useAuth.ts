import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * 
 * Provides access to:
 * - user: The currently logged in user (or null if not authenticated)
 * - isAuthenticated: Boolean indicating if a user is logged in
 * - isLoading: Boolean indicating if authentication state is being determined
 * - login: Function to log in a user
 * - register: Function to register a new user
 * - logout: Function to log out the current user
 * - updateUserData: Function to update user data in the context
 */
export const useAuth = () => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    updateUserData: auth.updateUserData
  };
};