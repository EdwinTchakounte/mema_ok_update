import Cookies from 'js-cookie';

export const cookieUtils = {
  // User preferences
  setUserPreferences: (preferences: any) => {
    const existing = cookieUtils.getUserPreferences() || {};
    const updated = { ...existing, ...preferences };
    Cookies.set('church_app_preferences', JSON.stringify(updated), { expires: 365 });
  },
  
  getUserPreferences: () => {
    const prefs = Cookies.get('church_app_preferences');
    return prefs ? JSON.parse(prefs) : null;
  },
  
  // Language preference
  setLanguage: (language: string) => {
    Cookies.set('church_app_language', language, { expires: 365 });
  },
  
  getLanguage: () => {
    return Cookies.get('church_app_language') || 'fr';
  },
  
  // Content cache
  setCachedContent: (type: string, content: any) => {
    Cookies.set(`church_app_${type}`, JSON.stringify(content), { expires: 1 });
  },
  
  getCachedContent: (type: string) => {
    const cached = Cookies.get(`church_app_${type}`);
    return cached ? JSON.parse(cached) : null;
  },
  
  // Clear all cookies
  clearAll: () => {
    Cookies.remove('church_app_preferences');
    Cookies.remove('church_app_language');
    Cookies.remove('church_app_news');
    Cookies.remove('church_app_audios');
    Cookies.remove('church_app_videos');
  }
};