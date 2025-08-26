import { Content } from '../types';

export const mockContent: Content[] = [
  // Audio Content
  {
    id: '1',
    title: 'Morning Prayer',
    description: 'Daily morning prayer to start your day with faith',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    duration: '15:30',
    size: '14.2 MB',
    uploadDate: '2025-01-08',
    downloads: 245,
    language: 'en'
  },
  {
    id: '2',
    title: 'Prière du matin',
    description: 'Prière quotidienne du matin pour commencer votre journée avec foi',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    duration: '12:45',
    size: '11.8 MB',
    uploadDate: '2025-01-08',
    downloads: 189,
    language: 'fr'
  },
  {
    id: '3',
    title: 'Sunday Sermon: Faith in Action',
    description: 'Inspiring sermon about putting faith into daily practice',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    duration: '45:20',
    size: '41.2 MB',
    uploadDate: '2025-01-07',
    downloads: 567,
    language: 'en'
  },
  
  // Video Content
  {
    id: '4',
    title: 'Bible Study: Psalms 23',
    description: 'Deep dive into the meaning and comfort of Psalms 23',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '28:15',
    size: '142.5 MB',
    uploadDate: '2025-01-06',
    downloads: 423,
    language: 'en'
  },
  {
    id: '5',
    title: 'Étude biblique: Jean 3:16',
    description: 'Exploration du verset le plus célèbre de la Bible',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '35:10',
    size: '180.3 MB',
    uploadDate: '2025-01-05',
    downloads: 312,
    language: 'fr'
  },
  
  // Image Content
  {
    id: '6',
    title: 'Scripture Verse of the Day',
    description: 'Beautiful inspirational quote from today\'s reading',
    type: 'image',
    url: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=800',
    size: '2.1 MB',
    uploadDate: '2025-01-08',
    downloads: 89,
    language: 'en'
  },
  {
    id: '7',
    title: 'Verset du jour',
    description: 'Belle citation inspirante de la lecture d\'aujourd\'hui',
    type: 'image',
    url: 'https://images.pexels.com/photos/11474642/pexels-photo-11474642.jpeg?auto=compress&cs=tinysrgb&w=800',
    size: '1.8 MB',
    uploadDate: '2025-01-08',
    downloads: 67,
    language: 'fr'
  },
  {
    id: '8',
    title: 'Church Community Photo',
    description: 'Beautiful moment from our last Sunday service',
    type: 'image',
    url: 'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=800',
    size: '3.4 MB',
    uploadDate: '2025-01-07',
    downloads: 134,
    language: 'en'
  }
];