

create table public.categories (
  id uuid not null default gen_random_uuid (),
  lebele text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;



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

create table public.products (
  id serial not null,
  name text not null,
  original_price numeric(10, 2) null,
  description text null,
  image text not null,
  sizes text[] null,
  stock integer null default 0,
  category_ids text[] null,
  created_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id)
) TABLESPACE pg_default;




create table public.promotions (
  id uuid not null default gen_random_uuid (),
  name character varying(255) not null,
  code character varying(50) not null,
  type character varying(20) not null,
  value integer not null,
  min_order integer null default 0,
  start_date date not null,
  end_date date not null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint promotions_pkey primary key (id),
  constraint promotions_code_key unique (code),
  constraint promotions_type_check check (
    (
      (type)::text = any (
        (
          array[
            'percentage'::character varying,
            'fixed'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_promotions_code on public.promotions using btree (code) TABLESPACE pg_default;

create index IF not exists idx_promotions_active on public.promotions using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_promotions_dates on public.promotions using btree (start_date, end_date) TABLESPACE pg_default;

create trigger update_promotions_updated_at BEFORE
update on promotions for EACH row
execute FUNCTION update_updated_at_column ();



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
