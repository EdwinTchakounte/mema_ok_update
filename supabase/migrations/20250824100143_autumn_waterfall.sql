-- Politiques RLS pour les buckets de stockage Supabase
-- Ces politiques permettent aux utilisateurs authentifiés d'uploader des fichiers

-- =====================================================
-- POLITIQUES POUR LE BUCKET 'news' (images)
-- =====================================================

-- Politique pour permettre l'insertion (upload) d'images dans le bucket 'news'
CREATE POLICY "Allow authenticated users to upload images to news bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news');

-- Politique pour permettre la lecture des images du bucket 'news'
CREATE POLICY "Allow public read access to news images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news');

-- Politique pour permettre la mise à jour des images du bucket 'news'
CREATE POLICY "Allow authenticated users to update news images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'news')
WITH CHECK (bucket_id = 'news');

-- Politique pour permettre la suppression des images du bucket 'news'
CREATE POLICY "Allow authenticated users to delete news images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'news');

-- =====================================================
-- POLITIQUES POUR LE BUCKET 'media' (audios)
-- =====================================================

-- Politique pour permettre l'insertion (upload) d'audios dans le bucket 'media'
CREATE POLICY "Allow authenticated users to upload audio to media bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Politique pour permettre la lecture des audios du bucket 'media'
CREATE POLICY "Allow public read access to media files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media');

-- Politique pour permettre la mise à jour des audios du bucket 'media'
CREATE POLICY "Allow authenticated users to update media files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Politique pour permettre la suppression des audios du bucket 'media'
CREATE POLICY "Allow authenticated users to delete media files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- =====================================================
-- POLITIQUES POUR LE BUCKET 'installer-documents' (si nécessaire)
-- =====================================================

-- Politique pour permettre l'insertion dans le bucket 'installer-documents'
CREATE POLICY "Allow authenticated users to upload installer documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'installer-documents');

-- Politique pour permettre la lecture des documents
CREATE POLICY "Allow authenticated users to read installer documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'installer-documents');

-- =====================================================
-- ACTIVATION DES POLITIQUES RLS
-- =====================================================

-- S'assurer que RLS est activé sur la table storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CRÉATION DES BUCKETS (si ils n'existent pas)
-- =====================================================

-- Créer le bucket 'news' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket 'media' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket 'installer-documents' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('installer-documents', 'installer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLITIQUES ALTERNATIVES (plus permissives si nécessaire)
-- =====================================================

-- Si vous voulez permettre à tout le monde (même non authentifié) d'uploader :
-- ATTENTION: Utilisez ces politiques avec précaution en production

/*
-- Politique très permissive pour le bucket 'news'
CREATE POLICY "Allow anyone to upload to news bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'news');

-- Politique très permissive pour le bucket 'media'
CREATE POLICY "Allow anyone to upload to media bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'media');
*/

-- =====================================================
-- VÉRIFICATION DES POLITIQUES
-- =====================================================

-- Pour vérifier que les politiques sont bien créées, vous pouvez exécuter :
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';