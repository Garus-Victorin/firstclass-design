create table public.order_items (
  id uuid not null default gen_random_uuid (),
  order_id uuid not null,
  product_id integer null,
  product_name character varying(255) not null,
  product_size character varying(50) null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  created_at timestamp with time zone null default now(),
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_order_items_order_id on public.order_items using btree (order_id) TABLESPACE pg_default;

create index IF not exists idx_order_items_product_id on public.order_items using btree (product_id) TABLESPACE pg_default;


create table public.categories (
  id uuid not null default gen_random_uuid (),
  lebele text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

create table public.orders (
  id uuid not null default gen_random_uuid (),
  order_number character varying(50) not null,
  customer_name character varying(255) not null,
  customer_phone character varying(20) not null,
  customer_email character varying(255) null,
  customer_address text null,
  delivery_method character varying(20) not null,
  total numeric(10, 2) not null,
  status character varying(20) not null default 'pending'::character varying,
  notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_order_number_key unique (order_number),
  constraint orders_delivery_method_check check (
    (
      (delivery_method)::text = any (
        (
          array[
            'livraison'::character varying,
            'retrait'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint orders_status_check check (
    (
      (status)::text = any (
        (
          array[
            'pending'::character varying,
            'confirmed'::character varying,
            'shipped'::character varying,
            'delivered'::character varying,
            'cancelled'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_orders_order_number on public.orders using btree (order_number) TABLESPACE pg_default;

create index IF not exists idx_orders_customer_phone on public.orders using btree (customer_phone) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_orders_created_at on public.orders using btree (created_at desc) TABLESPACE pg_default;

create trigger update_orders_updated_at BEFORE
update on orders for EACH row
execute FUNCTION update_updated_at_column ();



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
