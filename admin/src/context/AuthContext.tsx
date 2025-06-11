import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import apiClient from '@/lib/api';

interface Admin {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    Admin: Admin | null;
    isLoading: boolean;
    error: string | null;
    logout: () => void;
    clearError: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

//   check for existing token
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    setIsLoading(true)
                    // make request to dashbaord
                    const response = await apiClient.get('/profile');
                    setAdmin(response.data.data)
                } catch (error) {
                    localStorage.removeItem(token)
                    setIsAuthenticated(false)
                    setAdmin(null)
                } finally {
                    setIsLoading(false)
                }
            }
        };
        checkAuth();
    }, [])

    const logout = () => {
        localStorage.removeItem('adminToken')
        setAdmin(null)
        setIsAuthenticated(false)
    }

    const clearError = () => setError(null)

    return (
        <AuthContext.Provider value={{
            Admin: admin,
            isLoading,
            error,
            logout,
            clearError,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};