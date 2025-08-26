import React from 'react';
import { Home, Headphones, Video, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'audio', label: t('audio'), icon: Headphones },
    { id: 'video', label: t('video'), icon: Video },
    { id: 'images', label: t('images'), icon: ImageIcon },
  ];

  return (
    <nav className="bg-white shadow-lg border-t">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                activeTab === id ? 'scale-110' : ''
              }`} />
              <span className="text-xs font-medium">{label}</span>
              {activeTab === id && (
                <div className="w-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};