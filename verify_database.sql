-- Script de vérification rapide
-- Exécutez ce script dans Supabase SQL Editor pour vérifier que tout est OK

-- 1. Vérifier le nombre d'enregistrements dans chaque table
SELECT 
  'categories' as table_name, 
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ OK'
    ELSE '❌ Manquant'
  END as status
FROM categories
UNION ALL
SELECT 
  'products', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 12 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM products
UNION ALL
SELECT 
  'orders', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM orders
UNION ALL
SELECT 
  'order_items', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM order_items
UNION ALL
SELECT 
  'promotions', 
  COUNT(*),
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ OK'
    ELSE '❌ Manquant'
  END
FROM promotions;

-- 2. Vérifier les catégories
SELECT 
  '📁 Catégories' as section,
  name,
  slug,
  CASE WHEN image IS NOT NULL THEN '✅' ELSE '❌' END as has_image
FROM categories
ORDER BY name;

-- 3. Vérifier les produits avec leurs prix et stock
SELECT 
  '🛍️ Produits' as section,
  name,
  original_price,
  stock,
  CASE 
    WHEN stock = 0 THEN '❌ Rupture'
    WHEN stock < 5 THEN '⚠️ Faible'
    WHEN stock < 10 THEN '✅ Moyen'
    ELSE '✅ Bon'
  END as stock_status,
  array_length(sizes, 1) as nb_sizes,
  array_length(category_ids, 1) as nb_categories
FROM products
ORDER BY stock ASC;

-- 4. Vérifier les commandes
SELECT 
  '📦 Commandes' as section,
  order_number,
  customer_name,
  total,
  status,
  delivery_method,
  created_at::date as date
FROM orders
ORDER BY created_at DESC;

-- 5. Vérifier les promotions actives
SELECT 
  '🎁 Promotions' as section,
  name,
  code,
  type,
  value,
  CASE 
    WHEN type = 'percentage' THEN value || '%'
    ELSE value || ' FCFA'
  END as reduction,
  is_active,
  start_date,
  end_date,
  CASE 
    WHEN is_active AND CURRENT_DATE BETWEEN start_date AND end_date THEN '✅ Active'
    WHEN is_active AND CURRENT_DATE < start_date THEN '⏳ À venir'
    WHEN is_active AND CURRENT_DATE > end_date THEN '⏰ Expirée'
    ELSE '❌ Inactive'
  END as status
FROM promotions
ORDER BY is_active DESC, start_date DESC;

-- 6. Statistiques globales
SELECT 
  '📊 Statistiques' as section,
  (SELECT COUNT(*) FROM products) as total_produits,
  (SELECT COUNT(*) FROM products WHERE stock > 0) as produits_en_stock,
  (SELECT COUNT(*) FROM products WHERE stock = 0) as produits_rupture,
  (SELECT SUM(stock) FROM products) as stock_total,
  (SELECT COUNT(*) FROM categories) as total_categories,
  (SELECT COUNT(*) FROM orders) as total_commandes,
  (SELECT COUNT(*) FROM orders WHERE status = 'pending') as commandes_en_attente,
  (SELECT COUNT(*) FROM orders WHERE status = 'delivered') as commandes_livrees,
  (SELECT COALESCE(SUM(total), 0) FROM orders) as chiffre_affaires_total,
  (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'delivered') as ca_livre;

-- 7. Vérifier les politiques RLS
SELECT 
  '🔐 Politiques RLS' as section,
  schemaname,
  tablename,
  policyname,
  CASE 
    WHEN cmd LIKE '%SELECT%' THEN '✅ Lecture'
    WHEN cmd LIKE '%INSERT%' THEN '➕ Insertion'
    WHEN cmd LIKE '%UPDATE%' THEN '✏️ Modification'
    WHEN cmd LIKE '%DELETE%' THEN '🗑️ Suppression'
    ELSE '❓ Autre'
  END as type_acces
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'products', 'orders', 'order_items', 'promotions')
ORDER BY tablename, policyname;

-- 8. Produits les plus chers
SELECT 
  '💎 Top 5 Produits Chers' as section,
  name,
  original_price,
  stock
FROM products
ORDER BY original_price DESC
LIMIT 5;

-- 9. Produits avec stock faible
SELECT 
  '⚠️ Produits Stock Faible' as section,
  name,
  stock,
  original_price
FROM products
WHERE stock > 0 AND stock < 10
ORDER BY stock ASC;

-- 10. Résumé des commandes par statut
SELECT 
  '📈 Commandes par Statut' as section,
  status,
  COUNT(*) as nombre,
  SUM(total) as total_montant
FROM orders
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'pending' THEN 1
    WHEN 'confirmed' THEN 2
    WHEN 'shipped' THEN 3
    WHEN 'delivered' THEN 4
    WHEN 'cancelled' THEN 5
  END;
