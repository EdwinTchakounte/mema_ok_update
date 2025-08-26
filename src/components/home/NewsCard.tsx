import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Share2, Eye, Play, Pause, Volume2 } from 'lucide-react';
import { NewsItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface NewsCardProps {
  news: NewsItem;
  index: number;
  onShare?: (news: NewsItem) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, index, onShare }) => {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const title = language === 'fr' ? news.title_fr : news.title_en;
  const description = language === 'fr' ? news.description_fr : news.description_en;

  // Fetch associated audio
  const fetchAudio = async () => {
    if (audioUrl || loading) return;
    
    setLoading(true);
    try {
      const { data: audioData } = await supabase
        .from('audios')
        .select('audio_url')
        .eq('news_id', news.id)
        .eq('is_published', true)
        .single();

      if (audioData?.audio_url) {
        // Get public URL if it's a storage path
        if (!audioData.audio_url.startsWith('http')) {
          const { data } = supabase.storage
            .from('audios')
            .getPublicUrl(audioData.audio_url);
          setAudioUrl(data.publicUrl);
        } else {
          setAudioUrl(audioData.audio_url);
        }
      }
    } catch (error) {
      console.log('No audio found for this news');
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = async () => {
    if (!audioUrl) {
      await fetchAudio();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = audioUrl;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    // Increment share count
    await supabase
      .from('news')
      .update({ share_count: (news.share_count || 0) + 1 })
      .eq('id', news.id);

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || '',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${title} - ${description}`);
      alert(t('contentShared'));
    }

    onShare?.(news);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -2 }}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <audio ref={audioRef} preload="none" />
      
      {/* Image */}
      <div className="relative w-full h-40 md:h-48 lg:h-56 overflow-hidden rounded-t-2xl">
        <img
          src={news.image_url || 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain md:object-cover"
        />
        
        {/* Audio button */}
        <motion.button
          onClick={toggleAudio}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
        >
          {loading ? (
        <div className="w-2 h-2 border border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
        <Pause className="w-2 h-2 text-gray-600" />
          ) : (
        <Volume2 className="w-2 h-2 text-gray-600" />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
          {title}
        </h3>
        
        {description && (
          <p className="text-xs text-gray-600 mb-2.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              {news.scheduled_at 
                ? new Date(news.scheduled_at).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })
                : news.created_at 
                ? new Date(news.created_at).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })
                : 'Aujourd\'hui'
              }
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="w-3 h-3" />
              <span>{news.share_count || 0}</span>
            </div>
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
            >
              <Share2 className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};