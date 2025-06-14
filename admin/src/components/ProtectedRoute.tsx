import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Add a delay before redirecting to ensure token validation completes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isLoading && !isAuthenticated) {
      // Wait a bit before redirecting to handle race conditions
      timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 500);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ghana-green" />
      </div>
    );
  }
  
  // Check for token in localStorage as a backup validation
  const hasToken = !!localStorage.getItem('adminToken');
  
  if (shouldRedirect && !hasToken) {
    return <Navigate to="/" />;
  }
  
  // If we have a token or are authenticated, render the protected content
  if (isAuthenticated || hasToken) {
    return <Outlet />;
  }
  
  // Show loading state while we wait to determine if we should redirect
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-ghana-green" />
    </div>
  );
};