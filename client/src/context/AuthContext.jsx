import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shopzone_token'));
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('shopzone_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.data);
          } else {
            handleLogout();
          }
        } catch {
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (data) => {
    localStorage.setItem('shopzone_token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      addresses: data.addresses || [],
    });
  };

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        handleLoginSuccess(res.data);
        showToast(`Welcome back, ${res.data.name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async (role = 'customer') => {
    const creds =
      role === 'admin'
        ? { email: 'admin@shopzone.in', password: 'admin123password' }
        : { email: 'demo@shopzone.in', password: 'password123' };

    return login(creds.email, creds.password);
  };

  const register = async (name, email, password) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success) {
        handleLoginSuccess(res.data);
        showToast(`Account created! Welcome to ShopZone, ${res.data.name}`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shopzone_token');
    setToken(null);
    setUser(null);
  };

  const logout = () => {
    handleLogout();
    showToast('You have been signed out', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      if (res.success) {
        handleLoginSuccess(res.data);
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const res = await authApi.addAddress(addressData);
      if (res.success) {
        setUser((prev) => ({ ...prev, addresses: res.data }));
        showToast('Delivery address saved successfully', 'success');
        return { success: true, addresses: res.data };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        addAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

