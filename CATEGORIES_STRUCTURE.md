# Structure de la table Categories

## Schéma de la table

```sql
create table public.categories (
  id uuid not null default gen_random_uuid (),
  lebele text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
);
```

## Champs

- **id** (uuid): Identifiant unique généré automatiquement
- **lebele** (text): Nom de la catégorie (obligatoire)
- **description** (text): Description de la catégorie (optionnel)
- **created_at** (timestamp): Date de création automatique

## Utilisation dans le code

### TypeScript Interface
```typescript
interface Category {
  id: string
  lebele: string
  description?: string
  created_at?: string
}
```

### Récupérer les catégories
```typescript
const { data } = await supabase
  .from('categories')
  .select('*')
  .order('lebele')
```

### Créer une catégorie
```typescript
const { data, error } = await supabase
  .from('categories')
  .insert([{
    lebele: 'Nouvelle catégorie',
    description: 'Description optionnelle'
  }])
```

### Mettre à jour une catégorie
```typescript
const { error } = await supabase
  .from('categories')
  .update({
    lebele: 'Nom modifié',
    description: 'Nouvelle description'
  })
  .eq('id', categoryId)
```

### Supprimer une catégorie
```typescript
const { error } = await supabase
  .from('categories')
  .delete()
  .eq('id', categoryId)
```

## Relation avec les produits

Les produits stockent les IDs de catégories dans un tableau `category_ids`:

```typescript
interface Product {
  id: number
  name: string
  category_ids: string[] // Tableau d'UUIDs de catégories
  // ... autres champs
}
```

### Filtrer les produits par catégorie
```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .contains('category_ids', [categoryId])
```

## Données de test

Pour insérer des catégories de test, exécutez le fichier `insert-categories.sql` dans Supabase SQL Editor.
