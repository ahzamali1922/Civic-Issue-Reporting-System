import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/me/');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Handle Login
  const login = async (username, password) => {
    const response = await api.post('/api/login/', { username, password });
    setUser(response.data);
    return response.data;
  };

  // Handle Logout
  const logout = async () => {
    try {
      await api.get('/logout/'); // Calls your Django logout_view
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
      setUser(null); // Clear local state anyway
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);