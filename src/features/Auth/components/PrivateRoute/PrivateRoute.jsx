// src/Components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../Common/context/AuthContext'; // Adjust the path as needed

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
