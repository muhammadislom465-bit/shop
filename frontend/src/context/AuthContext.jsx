import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('uzum_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('uzum_token') || null);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const handleAuthChange = () => {
      const savedUser = localStorage.getItem('uzum_user');
      const savedToken = localStorage.getItem('uzum_token');
      setUser(savedUser ? JSON.parse(savedUser) : null);
      setToken(savedToken || null);
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const login = async (username_or_email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username_or_email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('uzum_token', access_token);
      localStorage.setItem('uzum_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      setAuthModalOpen(false);
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Kirishda xatolik yuz berdi. Parol yoki login noto'g'ri.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await authApi.register({ username, email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('uzum_token', access_token);
      localStorage.setItem('uzum_user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      setAuthModalOpen(false);
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Ro'yxatdan o'tishda xatolik yuz berdi.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('uzum_token');
    localStorage.removeItem('uzum_user');
    setToken(null);
    setUser(null);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const isAdmin = Boolean(user && user.is_admin);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        register,
        logout,
        openLogin,
        openRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
