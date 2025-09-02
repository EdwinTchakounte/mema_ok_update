// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

// // Supabase client (prod)
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: User | null;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const siteUrl = import.meta.env.VITE_SITE_URL!; // ex: https://mema-ok-update.vercel.app

  // Fonction pour transformer SupabaseUser en notre User
  const mapUser = (u: SupabaseUser): User => ({
    id: u.id,
    email: u.email ?? '',
    full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || '',
    role: u.email?.includes('admin') ? 'admin' : 'user',
    isAuthenticated: true,
  });

  // Sur montage, vérifier session existante
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(mapUser(data.session.user));
      }
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Connexion email/password
  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) return false;
    if (data.user) setUser(mapUser(data.user));
    return !!data.user;
  };

  // Connexion Google OAuth
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: siteUrl },
    });
    // Redirection automatique par Supabase
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
