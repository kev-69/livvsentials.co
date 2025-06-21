import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import {api} from '@/lib/api';

interface Admin {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    admin: Admin | null;
    isLoading: boolean;
    error: string | null;
    logout: () => void;
    clearError: () => void;
    isAuthenticated: boolean;
    setAdmin: (admin: Admin | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
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
                    const response = await api.get('/admin/profile');
                    setAdmin(response.data.data)
                    setIsAuthenticated(true)
                } catch (error) {
                    localStorage.removeItem('adminToken')
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
            admin: admin,
            isLoading,
            error,
            logout,
            clearError,
            isAuthenticated,
            setAdmin,
            setIsAuthenticated
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