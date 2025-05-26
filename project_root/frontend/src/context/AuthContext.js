import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Use the new instance

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        // axiosInstance will automatically use the token from localStorage via its request interceptor
        try {
          const res = await axiosInstance.get('/auth/me'); // No need for full URL or manual header
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to load user from token:', err);
          localStorage.removeItem('token');
          setToken(null);
          // No need to clear Authorization header from axiosInstance default, interceptor handles it
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token]); // Effect depends on token

  const login = async (accountNumber, pin) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { accountNumber, pin });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); // This will trigger the useEffect to load user
      // User and isAuthenticated will be set by the useEffect after token state changes and user is fetched.
      // For immediate UI update, we can set them here too, but useEffect handles it.
      setUser(res.data.user); 
      setIsAuthenticated(true);
      // axiosInstance request interceptor will pick up the new token for subsequent requests.
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      throw err;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); // This will trigger the useEffect
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Registration failed:', err.response ? err.response.data : err.message);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // This will trigger the useEffect which will ensure user is null & isAuthenticated is false
    setUser(null);
    setIsAuthenticated(false);
    // axiosInstance interceptor will notice the missing token
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token, // Though components might not need direct token access if axiosInstance is always used
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
