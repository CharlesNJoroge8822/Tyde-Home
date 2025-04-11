// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',

});

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // // Check auth status on initial load
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await api.get('/check');
  //       setUser(res.data.user);
  //     } catch (err) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  // Login user
  // const login = async (email, password) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await api.post('/login', { email, password });
  //     setUser(res.data.user);
  //     toast.success('Login successful!');
  //     return { success: true, user: res.data.user };
  //   } catch (err) {
  //     const errorMsg = err.response?.data?.message || 'Login failed';
  //     setError(errorMsg);
  //     toast.error(errorMsg);
  //     return { success: false, error: errorMsg };
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Google login
  const googleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      // This should redirect to your backend's Google auth endpoint
      window.location.href = 'http://127.0.0.1:5000/auth/login/google';
    } catch (err) {
      setError('Failed to initiate Google login');
      toast.error('Failed to initiate Google login');
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    // login,
    googleLogin,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};