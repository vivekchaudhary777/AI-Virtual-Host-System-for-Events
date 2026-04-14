// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vep_auth');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('vep_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vep_auth');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const updatePurchasedEvents = (newEvents) => {
    const updatedUser = { ...user, purchasedEvents: newEvents };
    setUser(updatedUser);
    localStorage.setItem('vep_auth', JSON.stringify(updatedUser));
  };

  const authContextValue = {
    user,
    login,
    logout,
    isAuthenticated,
    updatePurchasedEvents,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
