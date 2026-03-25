# Guide de Configuration Supabase pour FC-Design

## Étapes de Configuration

### 1. Créer les Tables dans Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez et exécutez le contenu du fichier `create.sql`

### 2. Insérer les Données de Test

1. Dans le **SQL Editor** de Supabase
2. Copiez et exécutez le contenu du fichier `insert_sample_data.sql`

### 3. Configurer les Politiques RLS (Row Level Security)

Les politiques sont déjà définies dans `create.sql` :
- Lecture publique pour `categories` et `products`
- Accès restreint pour `orders` (admin uniquement)

### 4. Vérifier la Configuration

1. Allez dans **Table Editor**
2. Vérifiez que les tables suivantes existent :
   - `categories`
   - `products`
   - `orders`
   - `order_items`
   - `promotions`

3. Vérifiez que les données de test sont présentes

### 5. Variables d'Environnement

Votre fichier `.env.local` est déjà configuré avec :
```
NEXT_PUBLIC_SUPABASE_URL=https://brvusrfaurzrshhhafof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Structure des Données

### Products
- `id`: SERIAL PRIMARY KEY
- `name`: TEXT
- `original_price`: NUMERIC(10,2)
- `description`: TEXT
- `image`: TEXT
- `sizes`: TEXT[]
- `stock`: INTEGER
- `category_ids`: TEXT[] (tableau d'UUIDs de catégories)
- `created_at`: TIMESTAMPTZ

### Categories
- `id`: UUID
- `name`: TEXT
- `slug`: TEXT
- `image`: TEXT
- `created_at`: TIMESTAMPTZ

### Orders
- `id`: UUID
- `order_number`: VARCHAR(50)
- `customer_name`: VARCHAR(255)
- `customer_phone`: VARCHAR(20)
- `customer_email`: VARCHAR(255)
- `customer_address`: TEXT
- `delivery_method`: VARCHAR(20) ('livraison' | 'retrait')
- `total`: DECIMAL(10, 2)
- `status`: VARCHAR(20) ('pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled')
- `notes`: TEXT
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Order Items
- `id`: UUID
- `order_id`: UUID (FK vers orders)
- `product_id`: INTEGER (FK vers products)
- `product_name`: VARCHAR(255)
- `product_size`: VARCHAR(50)
- `quantity`: INTEGER
- `unit_price`: DECIMAL(10, 2)
- `total_price`: DECIMAL(10, 2)
- `created_at`: TIMESTAMPTZ

### Promotions
- `id`: UUID
- `name`: VARCHAR(255)
- `code`: VARCHAR(50)
- `type`: VARCHAR(20) ('percentage' | 'fixed')
- `value`: INTEGER
- `min_order`: INTEGER
- `start_date`: DATE
- `end_date`: DATE
- `is_active`: BOOLEAN
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

## Fonctions Disponibles

### Dans `lib/data.ts`

```typescript
// Récupérer toutes les catégories
const categories = await getCategories()

// Récupérer tous les produits
const products = await getProducts()

// Récupérer un produit par ID
const product = await getProductById(1)

// Récupérer les produits d'une catégorie
const products = await getProductsByCategory('robes')
```

## Prochaines Étapes

1. ✅ Exécuter `create.sql` dans Supabase SQL Editor
2. ✅ Exécuter `insert_sample_data.sql` pour les données de test
3. ✅ Vérifier que l'application fonctionne sur http://localhost:3000
4. 📝 Ajouter vos propres produits via l'interface admin
5. 📝 Uploader les vraies images des produits

## Dépannage

### Erreur "relation does not exist"
- Vérifiez que vous avez bien exécuté `create.sql`

### Erreur "permission denied"
- Vérifiez les politiques RLS dans Supabase Dashboard > Authentication > Policies

### Images ne s'affichent pas
- Vérifiez que les chemins d'images sont corrects
- Utilisez le dossier `/public/uploads/` pour les images locales
- Ou configurez Supabase Storage pour les images en production

## Support

Pour toute question, consultez :
- Documentation Supabase : https://supabase.com/docs
- Documentation Next.js : https://nextjs.org/docs
