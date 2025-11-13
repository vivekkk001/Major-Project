import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated by looking for user data in localStorage
  const isAuthenticated = () => {
    const userData = localStorage.getItem('user');
    return !!userData;
  };

  if (!isAuthenticated()) {
    // Redirect to login with the current location so user can return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;