import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can return a loading spinner here
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && user.roles) {
    // Check if the user has at least one of the allowed roles
    // The roles in `user.roles` are expected to be like: { isAdmin: true, isCustomer: true }
    const userRoles = Object.keys(user.roles).filter(role => user.roles[role] === true);
    const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      // User is authenticated but does not have the required role
      // Redirect to a "not authorized" page or back to a default page like dashboard
      // For simplicity, redirecting to dashboard or a generic unauthorized message page
      console.warn(`User does not have required roles. Allowed: ${allowedRoles.join(', ')}, User has: ${userRoles.join(', ')}`);
      return <Navigate to="/dashboard" state={{ unauthorized: true, from: location }} replace />; 
      // Or: return <div>Not Authorized to view this page.</div>;
    }
  }

  return children;
};

export default ProtectedRoute;
