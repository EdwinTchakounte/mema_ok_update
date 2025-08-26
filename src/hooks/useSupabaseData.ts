import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NewsItem, AudioItem, VideoItem } from '../types';
import { mockNews, mockAudios, mockVideos } from '../data/mockData';
import { cookieUtils } from '../utils/cookies';

// Helper function to filter content by scheduled date
const filterByScheduledDate = <T extends { scheduled_at: string | null; is_published?: boolean | null }>(items: T[]): T[] => {
  const now = new Date();
  return items.filter(item => {
    // Si is_published existe et est false, ne pas afficher
    if (item.is_published !== undefined && item.is_published === false) {
      return false;
    }
    
    // Si pas de date programmée, afficher (si is_published n'est pas false)
    if (!item.scheduled_at) return true;
    
    // Si date programmée, vérifier qu'elle soit dans le passé
    const scheduledDate = new Date(item.scheduled_at);
    return scheduledDate <= now;
  });
};

// Helper function to get audio URL from Supabase Storage
const getAudioUrl = async (audioPath: string): Promise<string> => {
  try {
    const { data } = await supabase.storage
      .from('audios')
      .getPublicUrl(audioPath);
    return data.publicUrl;
  } catch (error) {
    console.warn('Error getting audio URL:', error);
    return audioPath; // Fallback to original path
  }
};

// Helper function to process audio items with storage URLs
const processAudioItems = async (audios: AudioItem[]): Promise<AudioItem[]> => {
  const processedAudios = await Promise.all(
    audios.map(async (audio) => {
      if (audio.audio_url && !audio.audio_url.startsWith('http')) {
        // If it's a storage path, get the public URL
        const publicUrl = await getAudioUrl(audio.audio_url);
        return { ...audio, audio_url: publicUrl };
      }
      return audio;
    })
  );
  return processedAudios;
};

export const useSupabaseData = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  useEffect(() => {
    // Listen for force refresh events
    const handleForceRefresh = () => {
      console.log('🔄 Force refresh triggered - clearing cache and fetching fresh data');
      // Clear all cached data
      cookieUtils.setCachedContent('news', null);
      cookieUtils.setCachedContent('audios', null);
      cookieUtils.setCachedContent('videos', null);
      
      if (isSupabaseConfigured) {
        fetchData(true); // Force fresh fetch
      } else {
        loadMockData();
      }
      setLastSync(new Date());
    };

    window.addEventListener('forceDataRefresh', handleForceRefresh);

    // If Supabase is not configured, use mock data immediately
    if (!isSupabaseConfigured) {
      loadMockData();
      return () => {
        window.removeEventListener('forceDataRefresh', handleForceRefresh);
      };
    }

    // Always fetch fresh data on initial load to check for newly scheduled content
    fetchData(false);

    return () => {
      window.removeEventListener('forceDataRefresh', handleForceRefresh);
    };
  }, []);

  const loadMockData = async () => {
    try {
      setLoading(true);
      console.log('Loading mock data - Supabase not configured');
      
      const processedMockAudios = await processAudioItems(mockAudios);
      
      // Filter mock data by scheduled date
      const filteredNews = filterByScheduledDate(mockNews);
      const filteredAudios = filterByScheduledDate(processedMockAudios);
      const filteredVideos = filterByScheduledDate(mockVideos);
      
      setNews(filteredNews);
      setAudios(filteredAudios);
      setVideos(filteredVideos);
      
      // Cache mock data
      cookieUtils.setCachedContent('news', filteredNews);
      cookieUtils.setCachedContent('audios', filteredAudios);
      cookieUtils.setCachedContent('videos', filteredVideos);
    } catch (err) {
      console.error('Error loading mock data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching data... (force: ${forceRefresh})`);
      
      // Try to load from cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedNews = cookieUtils.getCachedContent('news');
        const cachedAudios = cookieUtils.getCachedContent('audios');
        const cachedVideos = cookieUtils.getCachedContent('videos');
        
        if (cachedNews && cachedAudios && cachedVideos) {
          console.log('📦 Loading from cache');
          setNews(cachedNews);
          setAudios(cachedAudios);
          setVideos(cachedVideos);
          setLoading(false);
          return;
        }
      }
      
      const now = new Date().toISOString();
      console.log(`📅 Fetching content scheduled before: ${now}`);
      
      // Fetch news
      let newsData = null;
      let newsError = null;
      
      try {
        console.log('📰 Fetching news...');
        const result = await supabase
          .from('news')
          .select('*')
          .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
          .order('scheduled_at', { ascending: false, nullsFirst: true })
          .limit(10);
        newsData = result.data;
        newsError = result.error;
        console.log(`📰 Found ${newsData?.length || 0} news items`, newsData?.map(n => ({
          title: n.title_fr,
          scheduled_at: n.scheduled_at,
          is_published: n.is_published
        })));
      } catch (fetchError) {
        console.warn('Network error fetching news:', fetchError);
        newsError = fetchError;
      }

      if (newsError) {
        console.warn('News fetch error, using mock data:', newsError);
        const filteredMockNews = filterByScheduledDate(mockNews);
        setNews(filteredMockNews);
        cookieUtils.setCachedContent('news', filteredMockNews);
      } else {
        const rawNews = newsData.length > 0 ? newsData : mockNews;
        const finalNews = filterByScheduledDate(rawNews);
        console.log(`📰 Final news count after date filter: ${finalNews.length}`);
        setNews(finalNews);
        cookieUtils.setCachedContent('news', finalNews);
      }

      // Fetch audios
      let audiosData = null;
      let audiosError = null;
      
      try {
        console.log('🎵 Fetching audios...');
        const result = await supabase
          .from('audios')
          .select('*')
          .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
          .order('scheduled_at', { ascending: false, nullsFirst: true })
          .limit(10);
        audiosData = result.data;
        audiosError = result.error;
        console.log(`🎵 Found ${audiosData?.length || 0} audio items`, audiosData?.map(a => ({
          title: a.title_fr,
          scheduled_at: a.scheduled_at,
          is_published: a.is_published
        })));
      } catch (fetchError) {
        console.warn('Network error fetching audios:', fetchError);
        audiosError = fetchError;
      }

      if (audiosError) {
        console.warn('Audios fetch error, using mock data:', audiosError);
        const processedMockAudios = await processAudioItems(mockAudios);
        const filteredMockAudios = filterByScheduledDate(processedMockAudios);
        setAudios(filteredMockAudios);
        cookieUtils.setCachedContent('audios', filteredMockAudios);
      } else {
        const rawAudios = audiosData.length > 0 ? audiosData : mockAudios;
        const finalAudios = await processAudioItems(rawAudios);
        const filteredAudios = filterByScheduledDate(finalAudios);
        console.log(`🎵 Final audios count after date filter: ${filteredAudios.length}`);
        setAudios(filteredAudios);
        cookieUtils.setCachedContent('audios', filteredAudios);
      }

      // Fetch videos
      let videosData = null;
      let videosError = null;
      
      try {
        console.log('📹 Fetching videos...');
        const result = await supabase
          .from('videos')
          .select('*')
          .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
          .order('scheduled_at', { ascending: false, nullsFirst: true })
          .limit(10);
        videosData = result.data;
        videosError = result.error;
        console.log(`📹 Found ${videosData?.length || 0} video items`, videosData?.map(v => ({
          title: v.title_fr,
          scheduled_at: v.scheduled_at,
          is_published: v.is_published
        })));
      } catch (fetchError) {
        console.warn('Network error fetching videos:', fetchError);
        videosError = fetchError;
      }

      if (videosError) {
        console.warn('Videos fetch error, using mock data:', videosError);
        const filteredMockVideos = filterByScheduledDate(mockVideos);
        setVideos(filteredMockVideos);
        cookieUtils.setCachedContent('videos', filteredMockVideos);
      } else {
        const rawVideos = videosData.length > 0 ? videosData : mockVideos;
        const finalVideos = filterByScheduledDate(rawVideos);
        console.log(`📹 Final videos count after date filter: ${finalVideos.length}`);
        setVideos(finalVideos);
        cookieUtils.setCachedContent('videos', finalVideos);
      }

      console.log('✅ Data fetch completed successfully');

    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Failed to fetch data');
      // Fallback to mock data
      await loadMockData();
    } finally {
      setLoading(false);
    }
  };

  return { 
    news, 
    audios, 
    videos, 
    loading, 
    error, 
    refetch: () => fetchData(true), // Force toujours un refetch depuis Supabase lors de la sync
    lastSync
  };
};