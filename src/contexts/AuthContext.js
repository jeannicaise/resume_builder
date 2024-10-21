import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    // Essayer de récupérer l'utilisateur depuis localStorage lors de l'initialisation
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } 
  }, []);

  const login = async (username, password) => {
    const data = await AuthService.login(username, password);
     // Stocker les informations de l'utilisateur dans le localStorage
     console.log(data); // Pour voir les informations et vérifier que 'id' est inclus

     localStorage.setItem('user', JSON.stringify(data));
    setCurrentUser(data);
  };

  const logout = () => {
     // Effacer les informations de l'utilisateur lors de la déconnexion
     localStorage.removeItem('user');
    AuthService.logout();
    setCurrentUser(null);
  };

  const register = (username, email, password) => {
    return AuthService.register(username, email, password);
  };

  const value = {
    currentUser, 
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}