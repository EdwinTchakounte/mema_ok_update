import React, { useState } from 'react';
import { Download, Share2, ZoomIn, X } from 'lucide-react';
import { Content } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImageViewerProps {
  content: Content;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ content }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useLanguage();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = content.url;
    link.download = `${content.title}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('contentShared'));
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-lg">
        <div className="relative group">
          <img
            src={content.url}
            alt={content.title}
            className="w-full aspect-video object-cover cursor-pointer"
            onClick={openFullscreen}
          />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={openFullscreen}
              className="bg-white/90 backdrop-blur-sm text-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-white transform hover:scale-110 transition-all duration-200"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-2">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>{content.size} • {content.downloads} {t('downloads')}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative max-w-full max-h-full">
            <img
              src={content.url}
              alt={content.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};