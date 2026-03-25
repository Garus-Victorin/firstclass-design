# 🚀 GUIDE FINAL - Configuration FC Design

## ⚡ Configuration Rapide (5 minutes)

### Étape 1 : Exécuter le Script SQL Complet

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet **brvusrfaurzrshhhafof**
3. Cliquez sur **SQL Editor** (menu gauche)
4. Cliquez sur **+ New query**
5. Copiez TOUT le contenu du fichier **`setup_complete.sql`**
6. Collez dans l'éditeur
7. Cliquez sur **Run** (ou Ctrl+Enter)

✅ Vous devriez voir :
```
Catégories: 4 ✅ OK
Produits: 12 ✅ OK
Promotions: 3 ✅ OK
Commandes: 4 ✅ OK
Articles commande: 10 ✅ OK
```

### Étape 2 : Lancer l'Application

```bash
cd c:\Users\Victorin\Downloads\Compressed\fc-design
npm run dev
```

### Étape 3 : Tester

Ouvrez http://localhost:3000

✅ Vous devriez voir :
- 12 produits sur la page d'accueil
- 4 catégories (Robes, Hauts, Pantalons, Accessoires)
- Les prix en FCFA
- Les images (ou placeholder)

## 📱 Pages à Tester

### Frontend Public
- ✅ http://localhost:3000 - Page d'accueil
- ✅ http://localhost:3000/catalogue - Catalogue complet
- ✅ http://localhost:3000/produit/1 - Détail produit
- ✅ http://localhost:3000/panier - Panier
- ✅ http://localhost:3000/commande - Formulaire commande

### Admin
- ✅ http://localhost:3000/admin - Dashboard
- ✅ http://localhost:3000/admin/produits - Gestion produits
- ✅ http://localhost:3000/admin/categories - Gestion catégories
- ✅ http://localhost:3000/admin/commandes - Gestion commandes
- ✅ http://localhost:3000/admin/promotions - Gestion promotions

## 🗄️ Structure de la Base de Données

### Table: categories
```sql
- id (UUID)
- lebele (TEXT) -- Nom de la catégorie
- description (TEXT)
- created_at (TIMESTAMPTZ)
```

### Table: products
```sql
- id (SERIAL)
- name (TEXT)
- original_price (NUMERIC)
- description (TEXT)
- image (TEXT)
- sizes (TEXT[])
- stock (INTEGER)
- category_ids (TEXT[]) -- UUIDs des catégories
- created_at (TIMESTAMPTZ)
```

### Table: orders
```sql
- id (UUID)
- order_number (VARCHAR)
- customer_name, phone, email, address
- delivery_method ('livraison' | 'retrait')
- total (NUMERIC)
- status ('pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled')
- notes (TEXT)
- created_at, updated_at (TIMESTAMPTZ)
```

### Table: order_items
```sql
- id (UUID)
- order_id (FK → orders)
- product_id (FK → products)
- product_name, product_size
- quantity (INTEGER)
- unit_price, total_price (NUMERIC)
- created_at (TIMESTAMPTZ)
```

### Table: promotions
```sql
- id (UUID)
- name, code (VARCHAR)
- type ('percentage' | 'fixed')
- value, min_order (INTEGER)
- start_date, end_date (DATE)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)
```

## 📊 Données Insérées

### 4 Catégories
1. **Robes** - Collection de robes élégantes
2. **Hauts** - Tops, chemisiers et blouses
3. **Pantalons** - Pantalons et jeans
4. **Accessoires** - Sacs, écharpes et accessoires

### 12 Produits
**Robes (3):**
- Robe Élégante Noire - 95 000 FCFA
- Robe Florale d'Été - 85 000 FCFA
- Robe Cocktail Rouge - 120 000 FCFA

**Hauts (3):**
- Chemisier Blanc Classique - 45 000 FCFA
- Top Crop Moderne - 35 000 FCFA
- Blouse Dentelle - 55 000 FCFA

**Pantalons (3):**
- Jean Slim Bleu - 75 000 FCFA
- Pantalon Tailleur Noir - 85 000 FCFA
- Pantalon Cargo Beige - 65 000 FCFA

**Accessoires (3):**
- Sac à Main Cuir - 120 000 FCFA
- Écharpe Soie - 25 000 FCFA
- Ceinture Cuir Premium - 35 000 FCFA

### 3 Promotions
- **HIVER20** - 20% de réduction (min 100k)
- **BIENVENUE** - 10 000 FCFA de réduction (min 50k)
- **VIP15** - 15% de réduction (inactive)

### 4 Commandes de Test
- **CMD001** - Marie Kouassi - 367 000 FCFA (En attente)
- **CMD002** - Jean Koffi - 385 000 FCFA (Confirmée)
- **CMD003** - Awa Touré - 370 000 FCFA (Expédiée)
- **CMD004** - Paul Diallo - 95 000 FCFA (Livrée)

## ✅ Vérification Rapide

### Dans Supabase
1. Allez dans **Table Editor**
2. Vérifiez chaque table :
   - ✅ categories : 4 lignes
   - ✅ products : 12 lignes
   - ✅ promotions : 3 lignes
   - ✅ orders : 4 lignes
   - ✅ order_items : 10 lignes

### Dans l'Application
1. Page d'accueil : 12 produits visibles
2. Catalogue : Filtres fonctionnent
3. Admin produits : 12 produits en grille
4. Admin catégories : 4 catégories
5. Admin commandes : 4 commandes

## 🐛 Problèmes Courants

### Erreur "column does not exist"
**Solution :** Votre base utilise peut-être une ancienne structure. Exécutez `create_products.sql` puis `setup_complete.sql`

### Les produits ne s'affichent pas
**Solution :**
1. Ouvrez la console (F12)
2. Vérifiez les erreurs
3. Vérifiez que les données sont dans Supabase
4. Vérifiez les politiques RLS

### Images ne s'affichent pas
**Solution :** Les images utilisent `/placeholder.jpg`. Créez ce fichier dans `/public/` ou remplacez par vos images.

## 🎯 Prochaines Actions

1. ✅ Tester toutes les pages
2. ✅ Ajouter vos propres produits
3. ✅ Uploader vos vraies images
4. ✅ Personnaliser les catégories
5. ✅ Tester le panier et les commandes
6. ✅ Configurer le numéro WhatsApp
7. ✅ Déployer sur Vercel

## 📞 Support

- WhatsApp : 0196422780
- Consultez `CHECKLIST.md` pour une vérification complète
- Consultez `RECAPITULATIF.md` pour les détails techniques

---

**🎉 Votre application est prête à être utilisée !**
