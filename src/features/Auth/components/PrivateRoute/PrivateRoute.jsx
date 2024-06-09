import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../Common/context/AuthContext'; // Adjust the path as needed

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while auth state is being determined
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
