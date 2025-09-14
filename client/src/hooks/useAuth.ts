import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    console.log('Auth check - token exists:', !!token, 'stored role:', storedRole);
    
    if (token && storedRole) {
      // Use mock user with stored role (simplified for demo)
      const role = storedRole as any;
      const mockUser = {
        id: '1',
        firstName: role === 'student' 
          ? 'Student' 
          : role === 'teacher' 
          ? 'Teacher' 
          : role === 'nazim' 
          ? 'Nazim' 
          : role === 'parent' 
          ? 'Parent' 
          : role === 'raises_jamia'
          ? 'Rais e Jamia'
          : 'Admin',
        lastName: 'User',
        email: 'admin@madrassah.com',
        phone: '+1234567890',
        role: role,
        language: 'en' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('checkAuth: Setting user from localStorage:', mockUser);
      setUser(mockUser);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, role?: string) => {
    console.log('Login called with role:', role);
    
    // Create mock user (simplified for demo)
    const mockUser: User = {
      id: '1',
      firstName: role === 'student' 
        ? 'Student' 
        : role === 'teacher' 
        ? 'Teacher' 
        : role === 'nazim' 
        ? 'Nazim' 
        : role === 'parent' 
        ? 'Parent' 
        : role === 'raises_jamia'
        ? 'Rais e Jamia'
        : 'Admin',
      lastName: 'User',
      email: email,
      phone: '+1234567890',
      role: role as any || 'admin',
      language: 'en' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userRole', role || 'admin');
    
    console.log('Login: Setting user state:', mockUser);
    setUser(mockUser);
    console.log('Login: User state set successfully');
    
    // Force a re-render by using a small delay
    await new Promise(resolve => setTimeout(resolve, 10));
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    // Force a page reload to ensure clean state
    window.location.href = '/login';
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
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
