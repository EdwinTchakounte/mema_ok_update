import React from 'react';
import { Play, Calendar, TrendingUp } from 'lucide-react';
import { Content } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChurchSymbol } from '../common/ChurchSymbol';

interface FeaturedContentProps {
  content: Content[];
}

export const FeaturedContent: React.FC<FeaturedContentProps> = ({ content }) => {
  const { language, t } = useLanguage();

  const featuredContent = content
    .filter(item => item.language === language)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <ChurchSymbol type="bible" size="sm" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'image': return <ChurchSymbol type="dove" size="sm" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {t('latestContent')}
        </h2>
      </div>

      <div className="space-y-4">
        {featuredContent.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 cursor-pointer group"
          >
            <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200">
              {getTypeIcon(item.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
              <p className="text-sm text-gray-600 truncate">{item.description}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.uploadDate).toLocaleDateString()}
                </span>
                {item.duration && <span>{item.duration}</span>}
              </div>
            </div>

            <div className="text-blue-600 group-hover:scale-110 transition-transform duration-200">
              <Play className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};