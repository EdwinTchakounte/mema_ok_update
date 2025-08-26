import React from 'react';
import { Content } from '../../types';
import { AudioPlayer } from '../media/AudioPlayer';
import { VideoPlayer } from '../media/VideoPlayer';
import { ImageViewer } from '../media/ImageViewer';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContentGridProps {
  content: Content[];
  type?: 'audio' | 'video' | 'image' | 'all';
}

export const ContentGrid: React.FC<ContentGridProps> = ({ content, type = 'all' }) => {
  const { language, t } = useLanguage();

  const filteredContent = content.filter(item => {
    const typeMatch = type === 'all' || item.type === type;
    const languageMatch = item.language === language;
    return typeMatch && languageMatch;
  });

  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
        </div>
        <p className="text-gray-600">{t('noContent')}</p>
      </div>
    );
  }

  const renderContent = (item: Content) => {
    switch (item.type) {
      case 'audio':
        return <AudioPlayer key={item.id} content={item} />;
      case 'video':
        return <VideoPlayer key={item.id} content={item} />;
      case 'image':
        return <ImageViewer key={item.id} content={item} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {filteredContent.map(renderContent)}
    </div>
  );
};