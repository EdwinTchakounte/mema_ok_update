import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { VerseOfTheDay } from '../components/home/VerseOfTheDay';
import { NewsCard } from '../components/home/NewsCard';
import { AudioCard } from '../components/home/AudioCard';
import { VideoCard } from '../components/home/VideoCard';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { news, audios, videos, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 bg-white min-h-screen">
      {/* Verse of the Day */}
      <VerseOfTheDay />

      {/* Latest News */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-base font-semibold text-gray-900 mb-3 px-4"
        >
          {t('latestNews')}
        </motion.h2>
        
        <div className="space-y-2 px-4">
          {news.slice(0, 2).map((item, index) => (
            <NewsCard key={item.id} news={item} index={index} />
          ))}
        </div>
      </section>

      {/* Latest Audios */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base font-semibold text-gray-900 mb-3 px-4"
        >
          {t('latestAudios')}
        </motion.h2>
        
        <div className="overflow-x-auto">
          <div className="flex gap-3 px-4 pb-2">
            {audios.slice(0, 5).map((audio, index) => (
              <div key={audio.id} className="flex-shrink-0 w-72">
                <AudioCard audio={audio} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base font-semibold text-gray-900 mb-3 px-4"
        >
          {t('latestVideos')}
        </motion.h2>
        
        <div className="overflow-x-auto">
          <div className="flex gap-3 px-4 pb-2">
            {videos.slice(0, 5).map((video, index) => (
              <div key={video.id} className="flex-shrink-0 w-72">
                <VideoCard video={video} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};