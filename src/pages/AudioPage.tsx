import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc } from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useLanguage } from '../contexts/LanguageContext';
import { AudioCard } from '../components/home/AudioCard';

export const AudioPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'downloads'>('date');
  const { audios, loading } = useSupabaseData();
  const { language, t } = useLanguage();

  const filteredAndSortedAudios = useMemo(() => {
    let filtered = audios.filter(audio => {
      const title = language === 'fr' ? audio.title_fr : audio.title_en;
      const description = language === 'fr' ? audio.description_fr : audio.description_en;
      const searchTerm = searchQuery.toLowerCase();
      
      return (
        title?.toLowerCase().includes(searchTerm) ||
        description?.toLowerCase().includes(searchTerm)
      );
    });

    // Sort audios
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const titleA = language === 'fr' ? a.title_fr : a.title_en;
          const titleB = language === 'fr' ? b.title_fr : b.title_en;
          return (titleA || '').localeCompare(titleB || '');
        case 'downloads':
          return (b.download_count || 0) - (a.download_count || 0);
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [audios, searchQuery, sortBy, language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white via-blue-50 to-amber-50 rounded-2xl p-6 shadow-lg border border-blue-100"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎵</span>
          </div>
          {t('audio')}
        </h1>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            >
              <option value="date">Plus récent</option>
              <option value="title">Titre</option>
              <option value="downloads">Téléchargements</option>
            </select>
            
            <button className="p-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Audio Grid */}
      <div className="space-y-4">
        {filteredAndSortedAudios.map((audio, index) => (
          <motion.div
            key={audio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AudioCard audio={audio} index={index} />
          </motion.div>
        ))}
      </div>

      {filteredAndSortedAudios.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <p className="text-slate-600">{t('noContent')}</p>
        </motion.div>
      )}
    </div>
  );
};