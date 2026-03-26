-- ============================================
-- MIGRATION: Changer orders.id de UUID vers INTEGER AUTO-INCREMENT
-- ============================================

-- 1. Supprimer la contrainte de clé étrangère dans order_items
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

-- 2. Supprimer la table orders existante
DROP TABLE IF EXISTS orders CASCADE;

-- 3. Recréer la table orders avec ID INTEGER AUTO-INCREMENT
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
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

-- 4. Recréer les index
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 5. Recréer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Modifier order_items pour utiliser INTEGER
ALTER TABLE order_items DROP COLUMN IF EXISTS order_id;
ALTER TABLE order_items ADD COLUMN order_id INTEGER NOT NULL;

-- 7. Recréer la contrainte de clé étrangère
ALTER TABLE order_items 
  ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) 
  REFERENCES orders(id) 
  ON DELETE CASCADE;

-- 8. Recréer l'index
DROP INDEX IF EXISTS idx_order_items_order_id;
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 9. Insérer des données de test
INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, customer_address, delivery_method, total, status, created_at) VALUES
('CMD001', 'Marie Kouassi', '0701234567', 'marie@email.com', 'Cocody, Abidjan', 'livraison', 367000, 'pending', NOW() - INTERVAL '2 days'),
('CMD002', 'Jean Koffi', '0712345678', 'jean@email.com', '', 'retrait', 385000, 'confirmed', NOW() - INTERVAL '3 days'),
('CMD003', 'Awa Touré', '0723456789', 'awa@email.com', 'Plateau, Abidjan', 'livraison', 370000, 'shipped', NOW() - INTERVAL '5 days'),
('CMD004', 'Paul Diallo', '0734567890', 'paul@email.com', 'Marcory, Abidjan', 'livraison', 95000, 'delivered', NOW() - INTERVAL '7 days');

-- 10. Insérer les articles de commande
INSERT INTO order_items (order_id, product_id, product_name, product_size, quantity, unit_price, total_price) VALUES
-- Commande 1
(1, 1, 'Robe Élégante Noire', 'M', 2, 95000, 190000),
(1, 4, 'Chemisier Blanc Classique', 'L', 1, 45000, 45000),
(1, 10, 'Sac à Main Cuir', 'Unique', 1, 120000, 120000),
-- Commande 2
(2, 3, 'Robe Cocktail Rouge', 'S', 1, 120000, 120000),
(2, 7, 'Jean Slim Bleu', '38', 2, 75000, 150000),
(2, 11, 'Écharpe Soie', 'Unique', 1, 25000, 25000),
-- Commande 3
(3, 2, 'Robe Florale d''Été', 'M', 1, 85000, 85000),
(3, 8, 'Pantalon Tailleur Noir', '40', 2, 85000, 170000),
(3, 12, 'Ceinture Cuir Premium', 'M', 1, 35000, 35000),
-- Commande 4
(4, 1, 'Robe Élégante Noire', 'L', 1, 95000, 95000);

-- 11. Vérification
SELECT 'Migration terminée ✅' AS status;
SELECT * FROM orders ORDER BY id;
