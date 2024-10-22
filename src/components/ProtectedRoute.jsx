import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.rank)) {
    // If the user doesn't have the required role, redirect to the main page
    return <Navigate to="/" />;
  }

  // If the user is allowed, render the requested component
  return <Element {...rest} />;
};

export default ProtectedRoute;
