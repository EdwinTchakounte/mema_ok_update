import React from 'react';
import { motion } from 'framer-motion';
import { Home, Headphones, Video, Newspaper, Settings, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const baseTabs = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'audio', label: t('audio'), icon: Headphones },
    { id: 'video', label: t('video'), icon: Video },
    { id: 'news', label: t('news'), icon: Newspaper },
  ];

  // Ajouter l'onglet admin si l'utilisateur est admin
  const tabs = user?.role === 'admin' 
    ? [...baseTabs, { id: 'admin', label: 'Admin', icon: Shield }]
    : baseTabs;

  // Ajouter l'onglet paramètres à la fin
  tabs.push({ id: 'settings', label: 'Paramètres', icon: Settings });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Subtle backdrop */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-100/50" />
      
      <div className="relative px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-0"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Active indicator */}
              {activeTab === id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 w-1 h-1 bg-gray-800 rounded-full"
                  style={{ x: '-50%' }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              
              <Icon 
                className={`w-5 h-5 transition-colors duration-200 ${
                  activeTab === id 
                    ? id === 'admin' ? 'text-amber-600' : 'text-gray-800'
                    : 'text-gray-400'
                }`} 
              />
              
              <span 
                className={`text-xs font-medium transition-colors duration-200 ${
                  activeTab === id 
                    ? id === 'admin' ? 'text-amber-600' : 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};