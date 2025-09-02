import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
// Assure-toi d’avoir configuré ton client Supabase

interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:3000'

  // Vérifier si l'utilisateur est déjà connecté au montage
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
          role: session.user.email?.includes('admin') ? 'admin' : 'user',
          isAuthenticated: true,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Connexion avec email/password
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Erreur login email:', error.message);
      setIsLoading(false);
      return false;
    }

    if (data.user) {
      const userData: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '',
        role: data.user.email?.includes('admin') ? 'admin' : 'user',
        isAuthenticated: true,
      };
      setUser(userData);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // Connexion avec Google OAuth
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
     const redirectTo = import.meta.env.VITE_SITE_URL || window.location.origin;
  console.log("Redirect vers :", redirectTo);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo, // 🔑 dynamique (local ou vercel)
      },
    });

    if (error) {
      console.error('Erreur login Google:', error.message);
      setIsLoading(false);
      return false;
    }

    // Redirection gérée automatiquement par Supabase
    setIsLoading(false);
    return true;
  };

  // Déconnexion
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, loginWithGoogle, logout, isLoading }}>
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
