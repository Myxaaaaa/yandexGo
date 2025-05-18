import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PrivateRoute = ({ children }) => {
  const { state } = useApp();
  const isAuthenticated = state.currentUser !== null;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 