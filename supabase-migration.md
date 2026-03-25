# 🚀 Migration Supabase pour FC-Design (Next.js 16)

## 1. **Créer projet Supabase**
1. https://supabase.com → New Project `fc-design`
2. Région **Africa (Singapore)** pour low latency
3. Password fort → Sauvegardez

## 2. **Variables .env.local**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. **Tables SQL (SQL Editor Supabase)**
```sql
-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price BIGINT NOT NULL, -- FCFA
  original_price BIGINT,
  description TEXT,
  image TEXT NOT NULL,
  sizes TEXT[], -- ['S', 'M']
  stock INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_promo BOOLEAN DEFAULT false,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL, -- [{product_id, qty, size}]
  total BIGINT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## 4. **Seed Data (12 produits live)**
```sql
-- Categories
INSERT INTO categories (id, name, slug, image) VALUES
('00000000-0000-0000-0000-000000000001', 'Homme', 'homme', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'),
('00000000-0000-0000-0000-000000000002', 'Femme', 'femme', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'),
('00000000-0000-0000-0000-000000000003', 'Accessoires', 'accessoires', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'),
('00000000-0000-0000-0000-000000000004', 'Nouveautés', 'nouveautés', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Products (12 exacts lib/data.ts)
INSERT INTO products (id, name, slug, price, category_id, image, sizes, description, stock, is_new, is_promo, original_price) VALUES
('00000000-0000-0000-0000-000000000001', 'Blazer Classique Noir', 'blazer-classique-noir', 189000, '00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', ARRAY['S','M','L','XL'], 'Un blazer intemporel...', 15, true, false, NULL),
-- ... (11 autres produits identiques)
ON CONFLICT (slug) DO NOTHING;
```

## 5. **lib/supabase.ts** ✅ Déjà créé

## 6. **Admin Products Live** `app/admin/produits/page.tsx`
```typescript
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
  }

  return (
    <div>
      <h1>Produits ({products.length})</h1>
      {/* shadcn Table */}
    </div>
  )
}
```

## 7. **✅ Test 1-min**
```
1. Supabase → SQL Editor → Run tables + seed
2. pnpm dev
3. /admin/produits → Données LIVE ! 🎉
```

**Supabase = 5x plus simple que Prisma !** Auth/Stripe intégrés natif.

