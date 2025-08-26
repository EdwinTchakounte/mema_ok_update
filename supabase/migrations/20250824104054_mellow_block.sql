/*
  # Correction des politiques RLS pour la table news
  
  1. Politiques RLS
    - Permet aux administrateurs de gérer les actualités
    - Permet la lecture publique des actualités publiées
  
  2. Vérifications
    - S'assurer que la table news existe avec la bonne structure
    - Corriger les politiques si nécessaires
*/

-- Vérifier et corriger la structure de la table news si nécessaire
DO $$
BEGIN
  -- Vérifier si la colonne share_count existe, sinon l'ajouter
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE news ADD COLUMN share_count integer DEFAULT 0;
  END IF;
END $$;

-- Supprimer les anciennes politiques s'elles existent
DROP POLICY IF EXISTS "Admins can manage news" ON news;
DROP POLICY IF EXISTS "Anyone can read published news" ON news;
DROP POLICY IF EXISTS "Public can read published news" ON news;

-- Activer RLS sur la table news
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux administrateurs de gérer les actualités
CREATE POLICY "Admins can manage news"
  ON news
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

-- Politique pour permettre la lecture publique des actualités publiées
CREATE POLICY "Public can read published news"
  ON news
  FOR SELECT
  TO public
  USING (is_published = true);

-- Politique pour permettre aux utilisateurs authentifiés de lire toutes les actualités
CREATE POLICY "Authenticated users can read all news"
  ON news
  FOR SELECT
  TO authenticated
  USING (true);

-- Vérifier que les colonnes obligatoires ont des valeurs par défaut appropriées
ALTER TABLE news ALTER COLUMN title_fr SET DEFAULT '';
ALTER TABLE news ALTER COLUMN title_en SET DEFAULT '';
ALTER TABLE news ALTER COLUMN description_fr SET DEFAULT '';
ALTER TABLE news ALTER COLUMN description_en SET DEFAULT '';
ALTER TABLE news ALTER COLUMN image_url SET DEFAULT '';
ALTER TABLE news ALTER COLUMN share_count SET DEFAULT 0;
ALTER TABLE news ALTER COLUMN is_published SET DEFAULT false;
ALTER TABLE news ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE news ALTER COLUMN updated_at SET DEFAULT now();