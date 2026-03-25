# 🚀 Guide de Démarrage Rapide - FC Design

## ✅ Étape 1 : Créer les Tables Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet : **brvusrfaurzrshhhafof**
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Copiez TOUT le contenu du fichier `create.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

## ✅ Étape 2 : Insérer les Données de Test

1. Toujours dans **SQL Editor**
2. Créez une nouvelle requête (bouton "+ New query")
3. Copiez TOUT le contenu du fichier `insert_sample_data.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur **Run**

Vous devriez voir un résultat comme :
```
Catégories: 4
Produits: 12
Promotions: 3
Commandes: 4
Articles commande: 10
```

## ✅ Étape 3 : Vérifier les Données

1. Allez dans **Table Editor** dans Supabase
2. Vérifiez que vous avez :
   - ✅ 4 catégories (Robes, Hauts, Pantalons, Accessoires)
   - ✅ 12 produits avec prix et stock
   - ✅ 3 promotions
   - ✅ 4 commandes de test

## ✅ Étape 4 : Lancer l'Application

```bash
npm run dev
```

Ouvrez http://localhost:3000

## 📱 Pages Disponibles

### Frontend (Public)
- **/** - Page d'accueil avec produits
- **/catalogue** - Catalogue complet avec filtres
- **/produit/[id]** - Détails d'un produit
- **/panier** - Panier d'achat
- **/commande** - Formulaire de commande

### Admin
- **/admin** - Dashboard admin
- **/admin/produits** - Gestion des produits ✅
- **/admin/categories** - Gestion des catégories ✅
- **/admin/commandes** - Gestion des commandes ✅
- **/admin/promotions** - Gestion des promotions

## 🎯 Fonctionnalités Principales

### ✅ Gestion des Produits
- Créer, modifier, supprimer des produits
- Upload d'images
- Gestion du stock
- Multiples catégories par produit
- Tailles personnalisables

### ✅ Gestion des Catégories
- Créer des catégories avec slug
- Images de catégories
- Filtrage par catégorie

### ✅ Gestion des Commandes
- Voir toutes les commandes
- Changer le statut (pending → confirmed → shipped → delivered)
- Contacter client via WhatsApp
- Générer des factures PDF

### ✅ Système de Panier
- Ajouter/retirer des produits
- Sélection de taille
- Calcul automatique du total
- Persistance dans localStorage

## 🔧 Configuration

Votre fichier `.env.local` est déjà configuré :
```env
NEXT_PUBLIC_SUPABASE_URL=https://brvusrfaurzrshhhafof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Structure des Données

### Products
```typescript
{
  id: number
  name: string
  original_price: number
  description: string
  image: string
  sizes: string[]
  stock: number
  category_ids: string[] // UUIDs des catégories
  created_at: string
}
```

### Categories
```typescript
{
  id: string (UUID)
  name: string
  slug: string
  image: string
  created_at: string
}
```

### Orders
```typescript
{
  id: string (UUID)
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  delivery_method: 'livraison' | 'retrait'
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  order_items: OrderItem[]
}
```

## 🎨 Personnalisation

### Ajouter vos Produits
1. Allez sur http://localhost:3000/admin/produits
2. Cliquez sur "Ajouter un produit"
3. Remplissez le formulaire
4. Uploadez une image
5. Sélectionnez les catégories et tailles
6. Cliquez sur "Créer le produit"

### Modifier les Catégories
1. Allez sur http://localhost:3000/admin/categories
2. Cliquez sur les 3 points → Modifier
3. Changez le nom, slug ou image
4. Enregistrez

### Gérer les Commandes
1. Allez sur http://localhost:3000/admin/commandes
2. Cliquez sur "Voir" pour voir les détails
3. Changez le statut avec le menu déroulant
4. Contactez le client via WhatsApp
5. Générez une facture quand la commande est livrée

## 🐛 Dépannage

### Les produits ne s'affichent pas
- Vérifiez que vous avez exécuté `insert_sample_data.sql`
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que Supabase est accessible

### Erreur "relation does not exist"
- Vous n'avez pas exécuté `create.sql`
- Retournez à l'Étape 1

### Images ne s'affichent pas
- Les images de test utilisent `/placeholder.jpg`
- Remplacez par vos vraies images dans `/public/uploads/`
- Ou configurez Supabase Storage

### Erreur de permission
- Vérifiez les politiques RLS dans Supabase
- Allez dans Authentication → Policies
- Les tables doivent avoir des politiques de lecture publique

## 📞 Support

- WhatsApp : 0196422780
- Email : support@fcdesign.com

## 🎉 C'est Prêt !

Votre application e-commerce est maintenant fonctionnelle avec :
- ✅ Base de données Supabase configurée
- ✅ Données de test insérées
- ✅ Interface admin complète
- ✅ Frontend public avec panier
- ✅ Système de commandes

Bon développement ! 🚀
