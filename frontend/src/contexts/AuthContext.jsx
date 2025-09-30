import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by calling /me
      apiClient.getMe()
        .then((response) => {
          setUser(response.user);
          setEntreprise(response.user.entreprise);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.login(credentials);
      const { token, user: userData } = response;
      localStorage.setItem('token', token);
      setUser(userData);
      setEntreprise(userData.entreprise);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // New function to refresh entreprise data from /me
  const refreshEntreprise = async () => {
    try {
      const response = await apiClient.getMe();
      setUser(response.user);
      setEntreprise(response.user.entreprise);
    } catch (error) {
      console.error('Failed to refresh entreprise data', error);
    }
  };

  // New function to set entreprise for super-admin viewing admin interface
  const setEntrepriseForAdminView = (entreprise) => {
    setEntreprise(entreprise);
  };

  const clearEntrepriseForAdminView = () => {
    setEntreprise(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEntreprise(null);
  };

  const value = {
    user,
    entreprise,
    login,
    logout,
    loading,
    refreshEntreprise,
    setEntrepriseForAdminView,
    clearEntrepriseForAdminView,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
