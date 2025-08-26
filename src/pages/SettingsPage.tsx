import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Globe, 
  Download, 
  Shield, 
  HelpCircle, 
  Info, 
  Trash2,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Database,
  ChevronRight,
  Crown,
  LogOut,
  Edit3,
  Heart,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ChurchSymbol } from '../components/common/ChurchSymbol';
import { cookieUtils } from '../utils/cookies';
import { ProfileEditModal } from '../components/modals/ProfileEditModal';
import { DonationModal } from '../components/modals/DonationModal';
import { AboutModal } from '../components/modals/AboutModal';
import { HelpModal } from '../components/modals/HelpModal';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Load preferences from cookies
    const prefs = cookieUtils.getUserPreferences();
    if (prefs) {
      setDarkMode(prefs.darkMode || false);
      setNotifications(prefs.notifications !== false);
      setAutoDownload(prefs.autoDownload || false);
      setOfflineMode(prefs.offlineMode || false);
    }

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    cookieUtils.clearAll();
    logout();
  };

  const handleClearCache = () => {
    cookieUtils.clearAll();
    localStorage.clear();
    alert('Cache vidé avec succès');
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLanguage);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    cookieUtils.setUserPreferences({ darkMode: newDarkMode });
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNotificationToggle = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    cookieUtils.setUserPreferences({ notifications: newNotifications });
  };

  const handleAutoDownloadToggle = () => {
    const newAutoDownload = !autoDownload;
    setAutoDownload(newAutoDownload);
    cookieUtils.setUserPreferences({ autoDownload: newAutoDownload });
  };

  const handleOfflineModeToggle = () => {
    const newOfflineMode = !offlineMode;
    setOfflineMode(newOfflineMode);
    cookieUtils.setUserPreferences({ offlineMode: newOfflineMode });
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const now = new Date();
      console.log('🔄 Starting manual sync from settings at:', now.toISOString());
      
      // Clear cache before sync
      cookieUtils.clearAll();
      console.log('🗑️ Cache cleared');
      
      // Wait a moment to ensure cache is cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force refetch from Supabase
      if (typeof window !== 'undefined') {
        // Trigger a custom event to force data refresh
        window.dispatchEvent(new CustomEvent('forceDataRefresh'));
        console.log('📡 Force refresh event dispatched');
      }
      
      // Wait for data to be refreshed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('✅ Sync completed successfully');
      alert(`Synchronisation terminée à ${now.toLocaleTimeString()} ! Les données ont été actualisées.`);
      
    } catch (error) {
      console.error('Sync error:', error);
      alert('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const settingSections = [
    {
      title: 'Profil',
      items: [
        {
          label: user?.full_name || 'Nom non défini',
          sublabel: user?.email || 'Email non défini',
          icon: user?.role === 'admin' ? Crown : User,
          action: () => setShowProfileEdit(true),
          isProfile: true,
          isAdmin: user?.role === 'admin'
        },
        {
          label: 'Modifier le profil',
          sublabel: 'Mettre à jour vos informations',
          icon: Edit3,
          action: () => setShowProfileEdit(true)
        }
      ]
    },
    {
      title: 'Préférences',
      items: [
        {
          label: 'Langue',
          sublabel: language === 'fr' ? 'Français' : 'English',
          icon: Globe,
          action: handleLanguageToggle,
          toggle: true,
          checked: language === 'fr'
        },
        {
          label: 'Notifications',
          sublabel: notifications ? 'Activées' : 'Désactivées',
          icon: Bell,
          toggle: true,
          checked: notifications,
          action: handleNotificationToggle
        }
      ]
    },
    {
      title: 'Contenu',
      items: [
        {
          label: 'Téléchargement automatique',
          sublabel: autoDownload ? 'Activé' : 'Désactivé',
          icon: Download,
          toggle: true,
          checked: autoDownload,
          action: handleAutoDownloadToggle
        },
        {
          label: 'Mode hors ligne',
          sublabel: offlineMode ? 'Activé' : 'Désactivé',
          icon: Wifi,
          toggle: true,
          checked: offlineMode,
          action: handleOfflineModeToggle
        },
        {
          label: 'Qualité audio',
          sublabel: 'Haute qualité',
          icon: Volume2,
          action: () => {}
        }
      ]
    },
    {
      title: 'Données',
      items: [
        {
          label: 'Synchronisation',
          sublabel: 'Actualiser les données',
          icon: RefreshCw,
          action: handleSync,
          loading: syncing
        },
        {
          label: 'Vider le cache',
          sublabel: 'Libérer l\'espace de stockage',
          icon: Trash2,
          action: handleClearCache,
          destructive: true
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          label: 'Centre d\'aide',
          sublabel: 'FAQ et guides d\'utilisation',
          icon: HelpCircle,
          action: () => setShowHelp(true)
        },
        {
          label: 'À propos',
          sublabel: 'Informations sur l\'application',
          icon: Info,
          action: () => setShowAbout(true)
        },
        {
          label: 'Faire un don',
          sublabel: 'Soutenir notre mission',
          icon: Heart,
          action: () => setShowDonation(true)
        }
      ]
    },
    {
      title: 'Compte',
      items: [
        {
          label: 'Se déconnecter',
          sublabel: 'Quitter l\'application',
          icon: LogOut,
          action: handleLogout,
          destructive: true
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
        >
          <ChurchSymbol type="cross" className="text-white" size="md" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Personnalisez votre expérience</p>
      </motion.div>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + sectionIndex * 0.05 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden"
        >
          {/* Section Header */}
          <div className="px-4 py-3 border-b border-gray-100/50">
            <h2 className="font-semibold text-gray-900 text-sm">{section.title}</h2>
          </div>

          {/* Section Items */}
          <div className="divide-y divide-gray-100/50">
            {section.items.map((item, itemIndex) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + sectionIndex * 0.05 + itemIndex * 0.02 }}
                onClick={item.action}
                disabled={item.loading}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 ${
                  item.destructive ? 'hover:bg-red-50' : ''
                } ${item.loading ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    item.destructive 
                      ? 'bg-red-100' 
                      : item.isProfile && item.isAdmin
                      ? 'bg-gradient-to-br from-amber-100 to-amber-200'
                      : 'bg-gray-100'
                  }`}>
                    {item.loading ? (
                      <div className="w-4 h-4 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <item.icon className={`w-4 h-4 ${
                        item.destructive 
                          ? 'text-red-600' 
                          : item.isProfile && item.isAdmin
                          ? 'text-amber-600'
                          : 'text-gray-600'
                      }`} />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`font-medium text-sm ${
                      item.destructive ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.sublabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.toggle ? (
                    <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      item.checked ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        item.checked ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Modals */}
      {showProfileEdit && (
        <ProfileEditModal onClose={() => setShowProfileEdit(false)} />
      )}
      {showDonation && (
        <DonationModal onClose={() => setShowDonation(false)} />
      )}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};