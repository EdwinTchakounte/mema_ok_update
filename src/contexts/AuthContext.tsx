import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('churchApp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('churchApp_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password.length >= 6) {
      // Determine user role based on email
      const role = email.includes('admin') ? 'admin' : 'user';
      const displayName = fullName || 
        (email === 'admin@eglise.com' ? 'Administrateur' : 
         email === 'membre@eglise.com' ? 'Membre Fidèle' : 
         email.split('@')[0]);
      
      const userData: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        full_name: displayName,
        role: role,
        isAuthenticated: true
      };
      
      setUser(userData);
      localStorage.setItem('churchApp_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('churchApp_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};