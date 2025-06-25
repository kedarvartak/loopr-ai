import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // For now, we'll hardcode the authentication status.
  // Later, this will check for a valid JWT.
  const isAuthenticated = false; 

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute; 