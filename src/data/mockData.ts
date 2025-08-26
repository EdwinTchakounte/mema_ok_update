import { NewsItem, AudioItem, VideoItem } from '../types';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    image_url: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=800',
    title_fr: 'Nouvelle campagne d\'évangélisation',
    description_fr: 'Rejoignez-nous pour une campagne d\'évangélisation exceptionnelle qui touchera des milliers de cœurs.',
    title_en: 'New Evangelization Campaign',
    description_en: 'Join us for an exceptional evangelization campaign that will touch thousands of hearts.',
    scheduled_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    share_count: 45,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    image_url: 'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=800',
    title_fr: 'Conférence spirituelle ce weekend',
    description_fr: 'Une conférence transformatrice avec des orateurs inspirants du monde entier.',
    title_en: 'Spiritual Conference This Weekend',
    description_en: 'A transformative conference with inspiring speakers from around the world.',
    scheduled_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    share_count: 32,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    image_url: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=800',
    title_fr: 'Actualité future (ne doit pas apparaître)',
    description_fr: 'Cette actualité est programmée pour demain et ne doit pas être visible.',
    title_en: 'Future News (should not appear)',
    description_en: 'This news is scheduled for tomorrow and should not be visible.',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    share_count: 32,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockAudios: AudioItem[] = [
  {
    id: '1',
    news_id: null,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    title_fr: 'La foi qui déplace les montagnes',
    description_fr: 'Une prédication puissante sur la foi inébranlable',
    title_en: 'Faith That Moves Mountains',
    description_en: 'A powerful sermon on unwavering faith',
    scheduled_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    share_count: 128,
    download_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    news_id: null,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    title_fr: 'L\'amour inconditionnel de Dieu',
    description_fr: 'Découvrez la profondeur de l\'amour divin',
    title_en: 'God\'s Unconditional Love',
    description_en: 'Discover the depth of divine love',
    scheduled_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    share_count: 95,
    download_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    news_id: null,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    title_fr: 'La prière qui transforme',
    description_fr: 'Comment la prière peut changer votre vie',
    title_en: 'Prayer That Transforms',
    description_en: 'How prayer can change your life',
    scheduled_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    share_count: 76,
    download_count: 54,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    news_id: null,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
    title_fr: 'Audio futur (ne doit pas apparaître)',
    description_fr: 'Cet audio est programmé pour demain',
    title_en: 'Future Audio (should not appear)',
    description_en: 'This audio is scheduled for tomorrow',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    share_count: 76,
    download_count: 54,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: '1',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title_fr: 'Témoignage de transformation',
    description_fr: 'Un témoignage bouleversant de transformation spirituelle',
    title_en: 'Testimony of Transformation',
    description_en: 'A moving testimony of spiritual transformation',
    scheduled_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title_fr: 'Enseignement sur la grâce',
    description_fr: 'Comprendre la grâce divine dans notre vie quotidienne',
    title_en: 'Teaching on Grace',
    description_en: 'Understanding divine grace in our daily lives',
    scheduled_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title_fr: 'Vidéo future (ne doit pas apparaître)',
    description_fr: 'Cette vidéo est programmée pour demain',
    title_en: 'Future Video (should not appear)',
    description_en: 'This video is scheduled for tomorrow',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const dailyVerses = {
  fr: [
    {
      text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
      reference: "Jean 3:16"
    },
    {
      text: "Je puis tout par celui qui me fortifie.",
      reference: "Philippiens 4:13"
    },
    {
      text: "L'Éternel est mon berger: je ne manquerai de rien.",
      reference: "Psaume 23:1"
    }
  ],
  en: [
    {
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16"
    },
    {
      text: "I can do all things through Christ who strengthens me.",
      reference: "Philippians 4:13"
    },
    {
      text: "The Lord is my shepherd, I lack nothing.",
      reference: "Psalm 23:1"
    }
  ]
};