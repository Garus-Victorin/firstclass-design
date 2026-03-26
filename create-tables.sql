create table public.categories (
  id uuid not null default gen_random_uuid (),
  lebele text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

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

create table public.reviews (
  id uuid not null default gen_random_uuid (),
  customer_name character varying(255) not null,
  rating integer not null,
  comment text not null,
  is_active boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint reviews_pkey primary key (id),
  constraint reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_reviews_is_active on public.reviews using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_reviews_created_at on public.reviews using btree (created_at desc) TABLESPACE pg_default;

create table public.users (
  id uuid not null default gen_random_uuid (),
  nom text not null,
  prenom text not null,
  email text not null,
  mot_de_passe text not null,
  date_creation timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
) TABLESPACE pg_default;

create index IF not exists idx_users_email on public.users using btree (email) TABLESPACE pg_default;