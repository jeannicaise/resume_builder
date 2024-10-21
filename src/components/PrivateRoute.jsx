import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Si l'utilisateur n'est pas connecté, on le redirige vers la page de login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return currentUser ? children : <Navigate to ="/login"/> ;
};

export default PrivateRoute;
