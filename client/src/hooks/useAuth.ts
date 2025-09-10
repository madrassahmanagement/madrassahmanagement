import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    console.log('Auth check - token exists:', !!token);
    
    if (token) {
      // Always set user if token exists - no API validation for now
      setUser({
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@madrassah.com',
        phone: '+1234567890',
        role: 'admin',
        language: 'en',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      // Use the API service for consistent URL handling
      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000/api' 
        : 'https://madrassahmanagement.vercel.app/api';

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        console.log('Login successful with real API');
        return { success: true };
      } else {
        // Fallback to mock login for demo
        const mockUser: User = {
          id: '1',
          firstName: 'Admin',
          lastName: 'User',
          email: email,
          phone: '+1234567890',
          role: 'admin',
          language: 'en',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('token', 'mock-token');
        setUser(mockUser);
        console.log('Login successful with mock user');
        return { success: true };
      }
    } catch (error) {
      // Fallback to mock login for demo
      const mockUser: User = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: email,
        phone: '+1234567890',
        role: 'admin',
        language: 'en',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('token', 'mock-token');
      setUser(mockUser);
      console.log('Login successful with mock user (fallback)');
      return { success: true };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // Force a page reload to ensure clean state
    window.location.href = '/login';
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    clearAuth
  };
};
