import React, { useState, useMemo } from 'react';
import { SearchBar } from '../components/content/SearchBar';
import { ContentGrid } from '../components/content/ContentGrid';
import { Content } from '../types';

interface ContentPageProps {
  content: Content[];
  type: 'audio' | 'video' | 'image';
}

export const ContentPage: React.FC<ContentPageProps> = ({ content, type }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = useMemo(() => {
    if (!searchQuery) return content;
    
    return content.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [content, searchQuery]);

  return (
    <div className="space-y-6">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <ContentGrid content={filteredContent} type={type} />
    </div>
  );
};