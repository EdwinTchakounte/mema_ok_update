export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  isAuthenticated: boolean;
}

export interface NewsItem {
  id: string;
  image_url: string | null;
  title_fr: string;
  description_fr: string | null;
  title_en: string;
  description_en: string | null;
  scheduled_at: string | null;
  share_count: number | null;
  is_published?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AudioItem {
  id: string;
  news_id: string | null;
  audio_url: string;
  title_fr: string | null;
  description_fr: string | null;
  title_en: string | null;
  description_en: string | null;
  scheduled_at: string | null;
  share_count: number | null;
  download_count: number | null;
  is_published?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface VideoItem {
  id: string;
  youtube_url: string;
  title_fr: string | null;
  description_fr: string | null;
  title_en: string | null;
  description_en: string | null;
  scheduled_at: string | null;
  is_published?: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Translation {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export type Language = 'fr' | 'en';

export interface OnboardingStep {
  id: number;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: string;
  color: string;
}