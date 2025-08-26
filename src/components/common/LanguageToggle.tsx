import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-2">
      <Globe className="w-4 h-4 text-white/80" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
          language === 'en'
            ? 'bg-white text-blue-600 shadow-lg'
            : 'text-white/80 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
          language === 'fr'
            ? 'bg-white text-blue-600 shadow-lg'
            : 'text-white/80 hover:text-white'
        }`}
      >
        FR
      </button>
    </div>
  );
};