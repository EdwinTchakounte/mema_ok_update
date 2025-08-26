import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Loader,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  EyeOff,
  Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/supabase';
import { NewsItem, AudioItem, VideoItem } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'news' | 'audios' | 'videos'>('news');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    image?: number;
    audio?: number;
  }>({});
  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File;
    audio?: File;
  }>({});

  // Data states
  const [news, setNews] = useState<NewsItem[]>([]);
  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    description_fr: '',
    description_en: '',
    scheduled_at: '',
    image_url: '',
    audio_url: '',
    youtube_url: '',
    is_published: true
  });

  // Fonction pour uploader un fichier vers Supabase Storage
  const uploadFile = async (file: File, fileType: 'image' | 'audio', contentId: string): Promise<string | null> => {
    try {
      // Générer un nom unique pour le fichier
      const fileExtension = file.name.split('.').pop();
      const fileName = `${contentId}_${fileType}_${Date.now()}.${fileExtension}`;
      const bucketName = fileType === 'image' ? 'news' : 'media';
      const filePath = `${fileName}`;

      // Simuler le progress d'upload
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        setUploadProgress(prev => ({
          ...prev,
          [fileType]: Math.min(progress, 90) // Garder à 90% jusqu'à la fin
        }));
      }, 200);

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (error) {
        throw new Error(`Erreur d'upload: ${error.message}`);
      }

      // Finaliser le progress à 100%
      setUploadProgress(prev => ({
        ...prev,
        [fileType]: 100
      }));

      // Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;

    } catch (error: any) {
      console.error(`Erreur lors de l'upload du ${fileType}:`, error);
      setUploadProgress(prev => ({
        ...prev,
        [fileType]: 0
      }));
      throw error;
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-600">Vous devez être administrateur pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Check Supabase configuration
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Supabase Requise</h1>
          <p className="text-gray-600 mb-6">
            Pour utiliser le dashboard administrateur, vous devez configurer Supabase.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl text-left mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Étapes de configuration :</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Cliquez sur "Connect to Supabase" en haut à droite</li>
              <li>2. Créez un nouveau projet ou connectez un projet existant</li>
              <li>3. Les variables d'environnement seront configurées automatiquement</li>
              <li>4. Redémarrez l'application si nécessaire</li>
            </ol>
          </div>
          <p className="text-xs text-gray-500">
            En attendant, vous pouvez utiliser les autres fonctionnalités de l'app avec les données de démonstration.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Fetch news
      let newsData = null;
      let newsError = null;
      
      try {
        const result = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });
        newsData = result.data;
        newsError = result.error;
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.warn('Network error fetching news, using fallback:', fetchError);
        newsError = fetchError;
      }

      if (!newsError && newsData && newsData.length > 0) {
        setNews(newsData);
      } else {
        console.log('Using mock news data');
        setNews([]);
      }

      // Fetch audios
      let audiosData = null;
      let audiosError = null;
      
      try {
        const result = await supabase
          .from('audios')
          .select('*')
          .order('created_at', { ascending: false });
        audiosData = result.data;
        audiosError = result.error;
      } catch (fetchError) {
        console.warn('Network error fetching audios, using fallback:', fetchError);
        audiosError = fetchError;
      }

      if (!audiosError && audiosData && audiosData.length > 0) {
        setAudios(audiosData);
      } else {
        console.log('Using mock audios data');
        setAudios([]);
      }

      // Fetch videos
      let videosData = null;
      let videosError = null;
      
      try {
        const result = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        videosData = result.data;
        videosError = result.error;
      } catch (fetchError) {
        console.warn('Network error fetching videos, using fallback:', fetchError);
        videosError = fetchError;
      }

      if (!videosError && videosData && videosData.length > 0) {
        setVideos(videosData);
      } else {
        console.log('Using mock videos data');
        setVideos([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_en: '',
      description_fr: '',
      description_en: '',
      scheduled_at: '',
      image_url: '',
      audio_url: '',
      youtube_url: '',
      is_published: true
    });
    setEditingItem(null);
    setShowForm(false);
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier
      const maxSize = fileType === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB pour images, 50MB pour audio
      if (file.size > maxSize) {
        setError(`Le fichier ${fileType} ne doit pas dépasser ${fileType === 'image' ? '5MB' : '50MB'}`);
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = fileType === 'image' 
        ? ['image/jpeg', 'image/png', 'image/webp']
        : ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'];
      
      if (!allowedTypes.includes(file.type)) {
        setError(`Type de fichier non supporté pour ${fileType}`);
        return;
      }

      setSelectedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      
      // Réinitialiser l'erreur et le progress
      if (error) setError(null);
      setUploadProgress(prev => ({
        ...prev,
        [fileType]: 0
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Générer un ID unique pour ce contenu
      const contentId = editingItem || `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let imageUrl = formData.image_url;
      let audioUrl = formData.audio_url;

      // Upload des fichiers si sélectionnés
      if (selectedFiles.image) {
        imageUrl = await uploadFile(selectedFiles.image, 'image', contentId);
      }
      
      if (selectedFiles.audio && activeTab === 'audios') {
        audioUrl = await uploadFile(selectedFiles.audio, 'audio', contentId);
      }

      // Préparer les données selon le type de contenu
      let dataToSave: any = {
        title_fr: formData.title_fr || '',
        title_en: formData.title_en || '',
        description_fr: formData.description_fr || '',
        description_en: formData.description_en || '',
        scheduled_at: formData.scheduled_at || null,
        is_published: formData.is_published,
        updated_at: new Date().toISOString()
      };

      // Ajouter les champs spécifiques selon le type
      if (activeTab === 'news') {
        dataToSave.image_url = imageUrl || '';
        dataToSave.share_count = 0;
      } else if (activeTab === 'audios') {
        dataToSave.audio_url = audioUrl || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
        dataToSave.news_id = null;
        dataToSave.share_count = 0;
        dataToSave.download_count = 0;
      } else if (activeTab === 'videos') {
        dataToSave.youtube_url = formData.youtube_url || '';
      }

      let result;
      if (editingItem) {
        // Mise à jour
        result = await supabase
          .from(activeTab)
          .update(dataToSave)
          .eq('id', editingItem)
          .select()
          .single();
      } else {
        // Création
        const insertData = {
          ...dataToSave,
          created_at: new Date().toISOString()
        };
        
        result = await supabase
          .from(activeTab)
          .insert([insertData])
          .select()
          .single();
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(editingItem ? 'Contenu mis à jour avec succès' : 'Contenu créé avec succès');
      resetForm();
      setSelectedFiles({});
      setUploadProgress({});
      fetchData();
    } catch (error: any) {
      console.error('Erreur de sauvegarde:', error);
      setError(error.message || 'Erreur inconnue lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title_fr: item.title_fr || '',
      title_en: item.title_en || '',
      description_fr: item.description_fr || '',
      description_en: item.description_en || '',
      scheduled_at: item.scheduled_at ? new Date(item.scheduled_at).toISOString().slice(0, 16) : '',
      image_url: item.image_url || '',
      audio_url: item.audio_url || '',
      youtube_url: item.youtube_url || '',
      is_published: item.is_published !== false
    });
    setEditingItem(item.id);
    setSelectedFiles({});
    setUploadProgress({});
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase
        .from(activeTab)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess('Élément supprimé avec succès');
      fetchData();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la suppression');
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'news': return news;
      case 'audios': return audios;
      case 'videos': return videos;
      default: return [];
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'news': return FileText;
      case 'audios': return Music;
      case 'videos': return Video;
      default: return FileText;
    }
  };

  const getVisibilityStatus = (item: any) => {
    const now = new Date();
    const scheduledDate = item.scheduled_at ? new Date(item.scheduled_at) : null;
    
    if (!item.is_published) {
      return { status: 'Non publié', color: 'bg-red-100 text-red-800', icon: EyeOff };
    }
    
    if (!scheduledDate) {
      return { status: 'Visible', color: 'bg-green-100 text-green-800', icon: Eye };
    }
    
    if (scheduledDate <= now) {
      return { status: 'Visible', color: 'bg-green-100 text-green-800', icon: Eye };
    } else {
      return { status: 'Programmé', color: 'bg-orange-100 text-orange-800', icon: EyeOff };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600">Gérez vos contenus spirituels</p>
          <p className="text-sm text-gray-500 mt-1">
            Heure actuelle: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700 text-sm">{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['news', 'audios', 'videos'] as const).map((tab) => {
            const Icon = getTabIcon(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab === 'news' ? 'Actualités' : tab === 'audios' ? 'Audios' : 'Vidéos'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Button */}
      <div className="px-4 mt-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter {activeTab === 'news' ? 'une actualité' : activeTab === 'audios' ? 'un audio' : 'une vidéo'}
        </button>
      </div>

      {/* Content List */}
      <div className="px-4 mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : (
          getCurrentData().map((item: any) => {
            const visibility = getVisibilityStatus(item);
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title_fr || item.title_en || 'Sans titre'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description_fr || item.description_en || 'Sans description'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.scheduled_at ? new Date(item.scheduled_at).toLocaleString('fr-FR') : 'Publication immédiate'}
                      </span>
                      <span className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs ${visibility.color}`}>
                        <visibility.icon className="w-3 h-3" />
                        {visibility.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Modifier' : 'Ajouter'} {activeTab === 'news' ? 'une actualité' : activeTab === 'audios' ? 'un audio' : 'une vidéo'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre (Français) *
                    </label>
                    <input
                      type="text"
                      name="title_fr"
                      value={formData.title_fr}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Titre en français"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre (Anglais) *
                    </label>
                    <input
                      type="text"
                      name="title_en"
                      value={formData.title_en}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Titre en anglais"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Français)
                    </label>
                    <textarea
                      name="description_fr"
                      value={formData.description_fr}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                      placeholder="Description en français"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Anglais)
                    </label>
                    <textarea
                      name="description_en"
                      value={formData.description_en}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                      placeholder="Description en anglais"
                    />
                  </div>
                </div>

                {/* Date et Publication */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de programmation
                    </label>
                    <p className="text-xs text-gray-500 mb-1">
                      Heure actuelle: {new Date().toLocaleString('fr-FR')}
                    </p>
                    <input
                      type="datetime-local"
                      name="scheduled_at"
                      value={formData.scheduled_at}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le contenu sera visible après cette date/heure. Laissez vide pour publication immédiate.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publication
                    </label>
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            is_published: e.target.checked
                          }))}
                          className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Publier le contenu
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Si décoché, le contenu ne sera jamais visible, même après la date programmée.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Champs spécifiques selon le type */}
                {activeTab === 'news' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    
                    {/* Upload de fichier */}
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${
                      saving ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
                    }`}>
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                        id="image-upload"
                        disabled={saving}
                      />
                      <label htmlFor="image-upload" className={`cursor-pointer ${saving ? 'cursor-not-allowed' : ''}`}>
                        <span className="text-sm text-gray-600">
                          {selectedFiles.image ? selectedFiles.image.name : 'Cliquez pour télécharger une image'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
                      </label>
                      {uploadProgress.image !== undefined && uploadProgress.image > 0 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.image}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{uploadProgress.image}%</span>
                        </div>
                      )}
                    </div>

                    {/* URL alternative */}
                    <div className="text-center text-sm text-gray-500 mb-2">ou</div>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {activeTab === 'audios' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio
                    </label>
                    
                    {/* Upload de fichier */}
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${
                      saving ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
                    }`}>
                      <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        className="hidden"
                        id="audio-upload"
                        disabled={saving}
                      />
                      <label htmlFor="audio-upload" className={`cursor-pointer ${saving ? 'cursor-not-allowed' : ''}`}>
                        <span className="text-sm text-gray-600">
                          {selectedFiles.audio ? selectedFiles.audio.name : 'Cliquez pour télécharger un audio'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">MP3, WAV, M4A (max 50MB)</p>
                      </label>
                      {uploadProgress.audio !== undefined && uploadProgress.audio > 0 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress.audio}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{uploadProgress.audio}%</span>
                        </div>
                      )}
                    </div>

                    {/* URL alternative */}
                    <div className="text-center text-sm text-gray-500 mb-2">ou</div>
                    <input
                      type="url"
                      name="audio_url"
                      value={formData.audio_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                )}

                {activeTab === 'videos' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL YouTube *
                    </label>
                    <input
                      type="url"
                      name="youtube_url"
                      value={formData.youtube_url}
                      onChange={handleInputChange}
                      required={activeTab === 'videos'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    disabled={saving}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving || (uploadProgress.image && uploadProgress.image < 100) || (uploadProgress.audio && uploadProgress.audio < 100)}
                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {saving || (uploadProgress.image && uploadProgress.image < 100) || (uploadProgress.audio && uploadProgress.audio < 100) ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {uploadProgress.image && uploadProgress.image < 100 ? 'Upload image...' : 
                         uploadProgress.audio && uploadProgress.audio < 100 ? 'Upload audio...' : 
                         'Sauvegarde...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingItem ? 'Mettre à jour' : 'Créer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};