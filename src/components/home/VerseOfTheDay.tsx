import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Share2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChurchSymbol } from '../common/ChurchSymbol';
import { dailyVerses } from '../../data/mockData';

export const VerseOfTheDay: React.FC = () => {
  const { language, t } = useLanguage();
  
  // Get today's verse (rotate based on day of year)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const verseIndex = dayOfYear % dailyVerses[language].length;
  const todayVerse = dailyVerses[language][verseIndex];

  const handleShare = async () => {
    const shareText = `${todayVerse.text} - ${todayVerse.reference}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('verseOfTheDay'),
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert(t('contentShared'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-4 relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
    >
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-50 p-2 rounded-xl">
              <ChurchSymbol type="bible" className="text-gray-600" size="sm" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{t('verseOfTheDay')}</h3>
          </div>
          <button
            onClick={handleShare}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Verse content */}
        <div className="space-y-3">
          <div className="relative">
            <Quote className="absolute -top-1 -left-1 w-5 h-5 text-gray-200" />
            <p className="text-gray-700 text-sm leading-relaxed pl-5 italic">
              "{todayVerse.text}"
            </p>
          </div>
          
          <div className="flex justify-end">
            <span className="text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full text-xs">
              {todayVerse.reference}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};