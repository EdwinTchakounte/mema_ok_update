import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, Share2 } from 'lucide-react';
import { AudioItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface AudioCardProps {
  audio: AudioItem;
  index: number;
}

export const AudioCard: React.FC<AudioCardProps> = ({ audio, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { language, t } = useLanguage();

  const title = language === 'fr' ? audio.title_fr : audio.title_en;
  const description = language === 'fr' ? audio.description_fr : audio.description_en;

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = async () => {
    // Increment share count
    await supabase
      .from('audios')
      .update({ share_count: (audio.share_count || 0) + 1 })
      .eq('id', audio.id);

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Audio spirituel',
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
  };

  const handleDownload = async () => {
    // Increment download count
    await supabase
      .from('audios')
      .update({ download_count: (audio.download_count || 0) + 1 })
      .eq('id', audio.id);

    const link = document.createElement('a');
    link.href = audio.audio_url;
    link.download = `${title || 'audio'}.mp3`;
    link.click();
    alert(t('downloadStarted'));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
      className="w-full bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <audio
        ref={audioRef}
        src={audio.audio_url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate">
            {title || 'Audio sans titre'}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-0.5 ml-2">
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <Download className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400 transition-all duration-300 rounded-full"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 ml-0.5" />}
        </motion.button>

        <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          <span>{audio.download_count || 0} téléchargements</span>
        </div>
      </div>
    </motion.article>
  );
};