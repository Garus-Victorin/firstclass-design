-- ============================================
-- SCRIPT DE RÉINITIALISATION COMPLÈTE
-- Supprime et recrée toutes les tables
-- ============================================

-- 1. SUPPRIMER TOUTES LES TABLES EXISTANTES
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- 2. CRÉER LA FONCTION update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CRÉER LA TABLE categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lebele TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRÉER LA TABLE products
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  original_price NUMERIC(10, 2) NULL,
  description TEXT NULL,
  image TEXT NOT NULL,
  sizes TEXT[] NULL,
  stock INTEGER DEFAULT 0,
  category_ids TEXT[] NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRÉER LA TABLE orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255) NULL,
  customer_address TEXT NULL,
  delivery_method VARCHAR(20) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT orders_delivery_method_check CHECK (
    delivery_method IN ('livraison', 'retrait')
  ),
  CONSTRAINT orders_status_check CHECK (
    status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
  )
);

-- 6. CRÉER LA TABLE order_items (IMPORTANT!)
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id INTEGER NULL,
  product_name VARCHAR(255) NOT NULL,
  product_size VARCHAR(50) NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 7. CRÉER LA TABLE promotions
CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,
  value INTEGER NOT NULL,
  min_order INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT promotions_type_check CHECK (
    type IN ('percentage', 'fixed')
  )
);

-- 8. CRÉER LA TABLE reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CRÉER LES INDEX
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_reviews_is_active ON reviews(is_active);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- 10. CRÉER LES TRIGGERS
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. DÉSACTIVER RLS TEMPORAIREMENT (pour tester)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- 12. INSÉRER DES DONNÉES DE TEST
INSERT INTO categories (id, lebele, description) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Robes', 'Collection de robes élégantes'),
('550e8400-e29b-41d4-a716-446655440002', 'Hauts', 'Tops, chemisiers et blouses'),
('550e8400-e29b-41d4-a716-446655440003', 'Pantalons', 'Pantalons et jeans'),
('550e8400-e29b-41d4-a716-446655440004', 'Accessoires', 'Sacs, écharpes et accessoires');

INSERT INTO products (name, original_price, description, image, sizes, stock, category_ids) VALUES
('Robe Élégante Noire', 95000, 'Robe élégante parfaite pour les soirées', '/uploads/1774451509530-téléchargement.jpg', ARRAY['S', 'M', 'L', 'XL'], 15, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
('Robe Florale d''Été', 85000, 'Robe légère et confortable pour l''été', '/placeholder.jpg', ARRAY['S', 'M', 'L'], 20, ARRAY['550e8400-e29b-41d4-a716-446655440001']),
('Chemisier Blanc Classique', 45000, 'Chemisier blanc intemporel', '/placeholder.jpg', ARRAY['S', 'M', 'L', 'XL'], 30, ARRAY['550e8400-e29b-41d4-a716-446655440002']);

INSERT INTO promotions (name, code, type, value, min_order, start_date, end_date, is_active) VALUES
('Soldes d''hiver', 'HIVER20', 'percentage', 20, 100000, '2024-01-01', '2024-12-31', true),
('Première commande', 'BIENVENUE', 'fixed', 10000, 50000, '2024-01-01', '2024-12-31', true);

INSERT INTO reviews (customer_name, rating, comment, is_active) VALUES
('Marie K.', 5, 'Très bonne qualité et livraison rapide !', true),
('Sophie D.', 4, 'Belle boutique, personnel accueillant.', true);

-- 13. VÉRIFICATION
SELECT 'Tables créées avec succès!' AS message;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
