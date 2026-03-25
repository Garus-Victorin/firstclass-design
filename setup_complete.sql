-- ============================================
-- SCRIPT COMPLET POUR FC-DESIGN
-- Basé sur create_products.sql (structure existante)
-- ============================================

-- 1. SUPPRIMER LES DONNÉES EXISTANTES (optionnel)
-- Décommentez si vous voulez repartir de zéro
-- TRUNCATE TABLE order_items CASCADE;
-- TRUNCATE TABLE orders CASCADE;
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE categories CASCADE;
-- TRUNCATE TABLE promotions CASCADE;

-- 2. INSÉRER LES CATÉGORIES (avec lebele comme dans create_products.sql)
INSERT INTO categories (id, lebele, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Robes', 'Collection de robes élégantes'),
('550e8400-e29b-41d4-a716-446655440002', 'Hauts', 'Tops, chemisiers et blouses'),
('550e8400-e29b-41d4-a716-446655440003', 'Pantalons', 'Pantalons et jeans'),
('550e8400-e29b-41d4-a716-446655440004', 'Accessoires', 'Sacs, écharpes et accessoires')
ON CONFLICT (id) DO UPDATE SET
  lebele = EXCLUDED.lebele,
  description = EXCLUDED.description;

-- 3. INSÉRER LES PRODUITS
INSERT INTO products (name, original_price, description, image, sizes, stock, category_ids) VALUES
-- Robes
('Robe Élégante Noire', 95000, 'Robe élégante parfaite pour les soirées et événements spéciaux. Tissu de qualité premium avec finitions soignées.', '/uploads/1774451509530-téléchargement.jpg', ARRAY['S', 'M', 'L', 'XL'], 15, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
('Robe Florale d''Été', 85000, 'Robe légère et confortable pour l''été, motifs floraux tendance. Parfaite pour les journées ensoleillées.', '/placeholder.jpg', ARRAY['S', 'M', 'L'], 20, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
('Robe Cocktail Rouge', 120000, 'Robe cocktail sophistiquée, parfaite pour les grandes occasions. Coupe flatteuse et tissu luxueux.', '/placeholder.jpg', ARRAY['S', 'M', 'L', 'XL'], 8, ARRAY['550e8400-e29b-41d4-a716-446655440001']),

-- Hauts
('Chemisier Blanc Classique', 45000, 'Chemisier blanc intemporel, idéal pour le bureau ou les occasions formelles. Coton de qualité.', '/placeholder.jpg', ARRAY['S', 'M', 'L', 'XL'], 30, ARRAY['550e8400-e29b-41d4-a716-446655440002']),
('Top Crop Moderne', 35000, 'Top crop tendance et stylé pour un look décontracté. Matière stretch confortable.', '/placeholder.jpg', ARRAY['S', 'M', 'L'], 25, ARRAY['550e8400-e29b-41d4-a716-446655440002']),
('Blouse Dentelle', 55000, 'Blouse élégante avec détails en dentelle. Parfaite pour un look romantique et raffiné.', '/placeholder.jpg', ARRAY['S', 'M', 'L', 'XL'], 18, ARRAY['550e8400-e29b-41d4-a716-446655440002']),

-- Pantalons
('Jean Slim Bleu', 75000, 'Jean slim confortable et élégant, coupe moderne. Denim stretch de qualité supérieure.', '/placeholder.jpg', ARRAY['36', '38', '40', '42'], 18, ARRAY['550e8400-e29b-41d4-a716-446655440003']),
('Pantalon Tailleur Noir', 85000, 'Pantalon tailleur professionnel, coupe impeccable. Idéal pour le bureau et les occasions formelles.', '/placeholder.jpg', ARRAY['36', '38', '40', '42', '44'], 12, ARRAY['550e8400-e29b-41d4-a716-446655440003']),
('Pantalon Cargo Beige', 65000, 'Pantalon cargo tendance avec multiples poches. Style décontracté et pratique.', '/placeholder.jpg', ARRAY['36', '38', '40', '42'], 22, ARRAY['550e8400-e29b-41d4-a716-446655440003']),

-- Accessoires
('Sac à Main Cuir', 120000, 'Sac à main en cuir véritable, élégant et spacieux. Finitions artisanales de qualité.', '/placeholder.jpg', ARRAY['Unique'], 8, ARRAY['550e8400-e29b-41d4-a716-446655440004']),
('Écharpe Soie', 25000, 'Écharpe en soie douce et élégante, plusieurs coloris disponibles. Accessoire parfait pour toute saison.', '/placeholder.jpg', ARRAY['Unique'], 40, ARRAY['550e8400-e29b-41d4-a716-446655440004']),
('Ceinture Cuir Premium', 35000, 'Ceinture en cuir de qualité supérieure avec boucle élégante. Finitions soignées.', '/placeholder.jpg', ARRAY['S', 'M', 'L'], 15, ARRAY['550e8400-e29b-41d4-a716-446655440004'])
ON CONFLICT DO NOTHING;

-- 4. INSÉRER LES PROMOTIONS
INSERT INTO promotions (name, code, type, value, min_order, start_date, end_date, is_active) VALUES
('Soldes d''hiver', 'HIVER20', 'percentage', 20, 100000, '2024-01-01', '2024-01-31', true),
('Première commande', 'BIENVENUE', 'fixed', 10000, 50000, '2024-01-01', '2024-12-31', true),
('VIP', 'VIP15', 'percentage', 15, 0, '2024-01-01', '2024-06-30', false)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  value = EXCLUDED.value,
  min_order = EXCLUDED.min_order,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  is_active = EXCLUDED.is_active;

-- 5. INSÉRER DES COMMANDES DE TEST
INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_email, customer_address, delivery_method, total, status, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'CMD001', 'Marie Kouassi', '0701234567', 'marie@email.com', 'Cocody, Abidjan', 'livraison', 367000, 'pending', NOW() - INTERVAL '2 days'),
('650e8400-e29b-41d4-a716-446655440002', 'CMD002', 'Jean Koffi', '0712345678', 'jean@email.com', '', 'retrait', 385000, 'confirmed', NOW() - INTERVAL '3 days'),
('650e8400-e29b-41d4-a716-446655440003', 'CMD003', 'Awa Touré', '0723456789', 'awa@email.com', 'Plateau, Abidjan', 'livraison', 370000, 'shipped', NOW() - INTERVAL '5 days'),
('650e8400-e29b-41d4-a716-446655440004', 'CMD004', 'Paul Diallo', '0734567890', 'paul@email.com', 'Marcory, Abidjan', 'livraison', 95000, 'delivered', NOW() - INTERVAL '7 days')
ON CONFLICT (order_number) DO NOTHING;

-- 6. INSÉRER LES ARTICLES DE COMMANDE
INSERT INTO order_items (order_id, product_id, product_name, product_size, quantity, unit_price, total_price) VALUES
-- Commande CMD001
('650e8400-e29b-41d4-a716-446655440001', 1, 'Robe Élégante Noire', 'M', 2, 95000, 190000),
('650e8400-e29b-41d4-a716-446655440001', 4, 'Chemisier Blanc Classique', 'L', 1, 45000, 45000),
('650e8400-e29b-41d4-a716-446655440001', 10, 'Sac à Main Cuir', 'Unique', 1, 120000, 120000),
-- Commande CMD002
('650e8400-e29b-41d4-a716-446655440002', 3, 'Robe Cocktail Rouge', 'S', 1, 120000, 120000),
('650e8400-e29b-41d4-a716-446655440002', 7, 'Jean Slim Bleu', '38', 2, 75000, 150000),
('650e8400-e29b-41d4-a716-446655440002', 11, 'Écharpe Soie', 'Unique', 1, 25000, 25000),
-- Commande CMD003
('650e8400-e29b-41d4-a716-446655440003', 2, 'Robe Florale d''Été', 'M', 1, 85000, 85000),
('650e8400-e29b-41d4-a716-446655440003', 8, 'Pantalon Tailleur Noir', '40', 2, 85000, 170000),
('650e8400-e29b-41d4-a716-446655440003', 12, 'Ceinture Cuir Premium', 'M', 1, 35000, 35000),
-- Commande CMD004
('650e8400-e29b-41d4-a716-446655440004', 1, 'Robe Élégante Noire', 'L', 1, 95000, 95000)
ON CONFLICT DO NOTHING;

-- 7. VÉRIFICATION
SELECT 
  'Catégories' as table_name, 
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ OK'
    ELSE '❌ Manquant'
  END as status
FROM categories
UNION ALL
SELECT 
  'Produits', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 12 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM products
UNION ALL
SELECT 
  'Promotions', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM promotions
UNION ALL
SELECT 
  'Commandes', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM orders
UNION ALL
SELECT 
  'Articles commande', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM order_items;

-- 8. AFFICHER LES DONNÉES
SELECT '📁 CATÉGORIES' as section;
SELECT lebele, description FROM categories ORDER BY lebele;

SELECT '🛍️ PRODUITS' as section;
SELECT name, original_price, stock FROM products ORDER BY id;

SELECT '🎁 PROMOTIONS' as section;
SELECT name, code, type, value, is_active FROM promotions ORDER BY name;

SELECT '📦 COMMANDES' as section;
SELECT order_number, customer_name, total, status FROM orders ORDER BY created_at DESC;
