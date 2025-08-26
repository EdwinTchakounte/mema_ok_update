import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Heart, Share2, Download, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ChurchSymbol } from '../components/common/ChurchSymbol';
import { cookieUtils } from '../utils/cookies';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    cookieUtils.clearAll();
    logout();
  };

  const stats = [
    { label: 'Audios écoutés', value: '24', icon: '🎵' },
    { label: 'Vidéos regardées', value: '12', icon: '📹' },
    { label: 'Partages', value: '8', icon: '📤' },
    { label: 'Téléchargements', value: '15', icon: '⬇️' }
  ];

  const menuItems = [
    { label: 'Paramètres', icon: Settings, action: () => {} },
    { label: 'Mes favoris', icon: Heart, action: () => {} },
    { label: 'Partager l\'app', icon: Share2, action: () => {} },
    { label: 'Téléchargements', icon: Download, action: () => {} },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900 rounded-2xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-4"
          >
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
            {user?.role === 'admin' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {user?.full_name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 mb-4"
          >
            {user?.email}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
          >
            <ChurchSymbol type="dove" size="sm" className="text-white" />
            <span className="text-white/90 text-sm font-medium">
              {user?.role === 'admin' ? 'Administrateur' : 'Membre fidèle'}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-blue-100 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            onClick={item.action}
            className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 transition-all duration-200 border-b border-blue-50 last:border-b-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-amber-100 rounded-full flex items-center justify-center">
              <item.icon className="w-5 h-5 text-slate-700" />
            </div>
            <span className="font-medium text-slate-800">{item.label}</span>
            <div className="ml-auto">
              <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
      >
        <LogOut className="w-5 h-5" />
        {t('logout')}
      </motion.button>
    </div>
  );
};