import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Share2, ExternalLink } from 'lucide-react';
import YouTube from 'react-youtube';
import { VideoItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const { language, t } = useLanguage();

  const title = language === 'fr' ? video.title_fr : video.title_en;
  const description = language === 'fr' ? video.description_fr : video.description_en;

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(video.youtube_url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Vidéo spirituelle',
          text: description || '',
          url: video.youtube_url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(video.youtube_url);
      alert(t('contentShared'));
    }
  };

  const openYouTube = () => {
    window.open(video.youtube_url, '_blank');
  };

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -2 }}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      {/* Video Thumbnail */}
      <div className="relative h-36 overflow-hidden rounded-t-2xl">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title || 'Vidéo'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-300" />
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            onClick={() => setShowPlayer(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="w-3 h-3 text-gray-800 ml-0.5" />
          </motion.button>
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 bg-white rounded-full text-gray-600 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Share2 className="w-2.5 h-2.5" />
          </motion.button>
          <motion.button
            onClick={openYouTube}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 bg-white rounded-full text-gray-600 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ExternalLink className="w-2.5 h-2.5" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-1 leading-snug">
          {title || 'Vidéo sans titre'}
        </h3>
        
        {description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {video.scheduled_at 
              ? new Date(video.scheduled_at).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })
              : video.created_at 
              ? new Date(video.created_at).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })
              : 'Récemment'
            }
          </span>
          <motion.button
            onClick={() => setShowPlayer(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-gray-800 hover:text-gray-900 font-medium transition-colors flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
          >
            <Play className="w-2 h-2" />
            Regarder
          </motion.button>
        </div>
      </div>

      {/* YouTube Player Modal */}
      {showPlayer && videoId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowPlayer(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <motion.button
              onClick={() => setShowPlayer(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </motion.button>
            <div className="aspect-video rounded-xl overflow-hidden">
              <YouTube
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
};