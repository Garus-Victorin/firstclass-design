# ⭐ Avis Clients - Installation

## 1. Exécuter le SQL dans Supabase

1. Aller sur https://supabase.com/dashboard
2. Ouvrir **SQL Editor**
3. Exécuter le fichier `supabase/add_reviews.sql`

Cela va créer:
- ✅ Table `reviews`
- ✅ 6 avis de test
- ✅ Politiques RLS

## 2. Fonctionnalités

### Page Produit (Public)
- Section "⭐ Avis Clients" après "Vous aimerez aussi"
- Affichage des avis avec étoiles
- Note moyenne calculée automatiquement
- Design responsive (3 colonnes desktop, 2 tablette, 1 mobile)

### Admin (/admin/avis)
- Liste de tous les avis
- Activer/Masquer un avis (icône œil)
- Supprimer un avis
- Voir le produit associé
- Badge de statut (Actif/Masqué)

## 3. Structure des Avis

```typescript
interface Review {
  id: string
  product_id: number
  customer_name: string
  rating: number (1-5)
  comment: string
  is_active: boolean
  created_at: string
}
```

## 4. Ajouter des Avis Manuellement

Dans Supabase SQL Editor:

```sql
INSERT INTO reviews (product_id, customer_name, rating, comment, is_active) 
VALUES (1, 'Nom Client', 5, 'Excellent produit !', true);
```

## 5. Navigation Admin

Le lien "Avis" a été ajouté dans le menu admin avec l'icône étoile ⭐
