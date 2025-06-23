import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import {api} from '@/lib/api';

interface Admin {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePhoto: string
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
    refreshAdminData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fetch admin profile data
    const fetchAdminProfile = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/profile');
            setAdmin(response.data.data);
            setIsAuthenticated(true);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching admin profile:', error);
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
            setAdmin(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Function to refresh admin data
    const refreshAdminData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
            await fetchAdminProfile();
        } catch (error) {
            console.error('Error refreshing admin data:', error);
            throw error;
        }
    };

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    await fetchAdminProfile();
                } catch (error) {
                    // Error handling is already done in fetchAdminProfile
                }
            }
        };
        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
        setIsAuthenticated(false);
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            admin,
            isLoading,
            error,
            logout,
            clearError,
            isAuthenticated,
            setAdmin,
            setIsAuthenticated,
            refreshAdminData
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};