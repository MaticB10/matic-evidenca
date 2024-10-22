// contexts/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ element: Component }) => {
  const { user } = useContext(AuthContext);

  // Če uporabnik ni prijavljen, ga preusmeri na prijavno stran
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
