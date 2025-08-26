/*
  # Correction des politiques RLS pour les tables audios et videos
  
  1. Politiques RLS
    - Permet aux administrateurs de gérer les contenus
    - Permet la lecture publique des contenus publiés
  
  2. Corrections
    - Assurer la cohérence des politiques
    - Corriger les valeurs par défaut
*/

-- ===== TABLE AUDIOS =====

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Admins can manage audios" ON audios;
DROP POLICY IF EXISTS "Anyone can read published audios" ON audios;
DROP POLICY IF EXISTS "Authenticated users can read all audios" ON audios;
DROP POLICY IF EXISTS "Public can read published audios" ON audios;

-- Activer RLS
ALTER TABLE audios ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs
CREATE POLICY "Admins can manage audios"
  ON audios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique pour la lecture publique
CREATE POLICY "Public can read published audios"
  ON audios
  FOR SELECT
  TO public
  USING (is_published = true);

-- Politique pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can read all audios"
  ON audios
  FOR SELECT
  TO authenticated
  USING (true);

-- Corriger les valeurs par défaut
ALTER TABLE audios ALTER COLUMN title_fr SET DEFAULT '';
ALTER TABLE audios ALTER COLUMN title_en SET DEFAULT '';
ALTER TABLE audios ALTER COLUMN description_fr SET DEFAULT '';
ALTER TABLE audios ALTER COLUMN description_en SET DEFAULT '';
ALTER TABLE audios ALTER COLUMN share_count SET DEFAULT 0;
ALTER TABLE audios ALTER COLUMN download_count SET DEFAULT 0;
ALTER TABLE audios ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE audios ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE audios ALTER COLUMN updated_at SET DEFAULT now();

-- ===== TABLE VIDEOS =====

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Admins can manage videos" ON videos;
DROP POLICY IF EXISTS "Public can read published videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can read all videos" ON videos;

-- Activer RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs
CREATE POLICY "Admins can manage videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Politique pour la lecture publique
CREATE POLICY "Public can read published videos"
  ON videos
  FOR SELECT
  TO public
  USING (is_published = true);

-- Politique pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can read all videos"
  ON videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Corriger les valeurs par défaut
ALTER TABLE videos ALTER COLUMN title_fr SET DEFAULT '';
ALTER TABLE videos ALTER COLUMN title_en SET DEFAULT '';
ALTER TABLE videos ALTER COLUMN description_fr SET DEFAULT '';
ALTER TABLE videos ALTER COLUMN description_en SET DEFAULT '';
ALTER TABLE videos ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE videos ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE videos ALTER COLUMN updated_at SET DEFAULT now();