create table public.categories (
  id uuid not null default gen_random_uuid (),
  lebele text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;