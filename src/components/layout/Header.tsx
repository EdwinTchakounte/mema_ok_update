import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Globe, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { ChurchSymbol } from '../common/ChurchSymbol';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'fr' ? 'Bonjour' : 'Good morning';
    if (hour < 18) return language === 'fr' ? 'Bon après-midi' : 'Good afternoon';
    return language === 'fr' ? 'Bonsoir' : 'Good evening';
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/98 backdrop-blur-xl border-b border-gray-100/30 shadow-sm ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and greeting */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gray-100 rounded-2xl flex items-center justify-center shadow-sm"
            >
              <ChurchSymbol type="cross" className="text-gray-600" size="sm" />
            </motion.div>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {t('appTitle')}
              </h1>
              {user && (
                <p className="text-xs text-gray-500 hidden sm:block">
                  {getGreeting()}, {user.full_name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Supabase Status */}
            {!isSupabaseConfigured && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                <Database className="w-3 h-3" />
                <span>DB non configurée</span>
              </motion.div>
            )}

            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'fr'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notification */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};