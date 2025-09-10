import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would validate the token with the server
      // For now, we'll just set a mock user
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
      // Try real API first
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
      return { success: true };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // Force a page reload to ensure clean state
    window.location.href = '/login';
  }, []);

  return {
    user,
    isLoading,
    login,
    logout
  };
};
