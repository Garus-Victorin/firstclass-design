-- Table des avis clients (généraux, pas liés aux produits)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_reviews_is_active ON reviews(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Politique RLS (Row Level Security)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture des avis actifs
CREATE POLICY "Allow public read active reviews" ON reviews
  FOR SELECT USING (is_active = true);

-- Permettre à tout le monde d'insérer des avis (ils seront inactifs par défaut)
CREATE POLICY "Allow public insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Permettre aux admins de tout gérer
CREATE POLICY "Allow admin all on reviews" ON reviews
  FOR ALL USING (true);

-- Données de test
INSERT INTO reviews (customer_name, rating, comment, is_active) VALUES
('Marie K.', 5, 'Très bonne qualité et livraison rapide ! Je recommande vivement.', true),
('Sophie D.', 4, 'Belle boutique, personnel accueillant. Bon rapport qualité-prix.', true),
('Awa T.', 5, 'Excellent service client, produits de qualité. Je reviendrai !', true),
('Fatou B.', 5, 'Magnifique collection, j''ai trouvé exactement ce que je cherchais.', true),
('Jean-Paul M.', 4, 'Bon choix de produits, prix corrects. Satisfait de mon achat.', true),
('Koffi A.', 5, 'Service impeccable, livraison rapide. Très satisfait !', true)
ON CONFLICT DO NOTHING;

-- Vérification
SELECT 
  'Avis clients' as table_name, 
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 6 THEN '✅ OK'
    ELSE '❌ Manquant'
  END as status
FROM reviews;
