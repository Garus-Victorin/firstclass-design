# ✅ Checklist de Vérification - FC Design

## 🗄️ Étape 1 : Vérifier Supabase

### Dans Supabase Dashboard (https://supabase.com/dashboard)

#### 1.1 Vérifier les Tables
- [ ] Aller dans **Table Editor**
- [ ] Vérifier que ces tables existent :
  - [ ] `categories` (4 lignes)
  - [ ] `products` (12 lignes)
  - [ ] `orders` (4 lignes)
  - [ ] `order_items` (10 lignes)
  - [ ] `promotions` (3 lignes)

#### 1.2 Vérifier les Données
- [ ] Ouvrir la table `categories`
- [ ] Vérifier qu'il y a : Robes, Hauts, Pantalons, Accessoires
- [ ] Ouvrir la table `products`
- [ ] Vérifier qu'il y a au moins 12 produits avec prix et stock

#### 1.3 Vérifier les Politiques RLS
- [ ] Aller dans **Authentication** → **Policies**
- [ ] Vérifier que `categories` a une politique de lecture publique
- [ ] Vérifier que `products` a une politique de lecture publique

## 💻 Étape 2 : Vérifier l'Application

### 2.1 Démarrer l'Application
```bash
cd c:\Users\Victorin\Downloads\Compressed\fc-design
npm run dev
```

- [ ] Le serveur démarre sans erreur
- [ ] Ouvrir http://localhost:3000
- [ ] La page se charge sans erreur

### 2.2 Vérifier la Page d'Accueil
- [ ] Les produits s'affichent dans "Nouveautés"
- [ ] Les catégories s'affichent dans "Nos Catégories"
- [ ] Les images se chargent (ou placeholder)
- [ ] Les prix s'affichent correctement (format FCFA)

### 2.3 Vérifier le Catalogue
- [ ] Aller sur http://localhost:3000/catalogue
- [ ] Les produits s'affichent en grille
- [ ] Le compteur affiche "12 produits" (ou le nombre correct)
- [ ] Les filtres de catégories fonctionnent
- [ ] Le tri par prix fonctionne
- [ ] Le slider de prix fonctionne

### 2.4 Vérifier la Page Produit
- [ ] Cliquer sur un produit
- [ ] La page produit s'affiche avec toutes les infos
- [ ] Les tailles sont sélectionnables
- [ ] Le bouton "Ajouter au panier" fonctionne
- [ ] Le stock s'affiche correctement

### 2.5 Vérifier le Panier
- [ ] Ajouter un produit au panier
- [ ] Aller sur http://localhost:3000/panier
- [ ] Le produit apparaît dans le panier
- [ ] Le total est calculé correctement
- [ ] Modifier la quantité fonctionne
- [ ] Supprimer un article fonctionne

## 🔧 Étape 3 : Vérifier l'Admin

### 3.1 Page Admin Produits
- [ ] Aller sur http://localhost:3000/admin/produits
- [ ] Les 12 produits s'affichent en grille
- [ ] Cliquer sur "Voir" pour voir les détails
- [ ] Cliquer sur "Modifier" pour éditer un produit
- [ ] Les catégories s'affichent correctement
- [ ] Le stock s'affiche avec les bonnes couleurs

### 3.2 Créer un Nouveau Produit
- [ ] Cliquer sur "Ajouter un produit"
- [ ] Remplir le formulaire :
  - [ ] Nom : "Test Produit"
  - [ ] Prix : 50000
  - [ ] Stock : 10
  - [ ] Sélectionner une catégorie
  - [ ] Sélectionner des tailles (S, M, L)
- [ ] Cliquer sur "Créer le produit"
- [ ] Le produit apparaît dans la liste
- [ ] Vérifier dans Supabase que le produit est créé

### 3.3 Page Admin Catégories
- [ ] Aller sur http://localhost:3000/admin/categories
- [ ] Les 4 catégories s'affichent
- [ ] Cliquer sur "Modifier" pour une catégorie
- [ ] Modifier le nom
- [ ] Enregistrer
- [ ] La modification apparaît

### 3.4 Créer une Nouvelle Catégorie
- [ ] Cliquer sur "Nouvelle catégorie"
- [ ] Remplir :
  - [ ] Nom : "Test Catégorie"
  - [ ] Slug : "test-categorie"
  - [ ] Image : "/placeholder.jpg"
- [ ] Cliquer sur "Créer"
- [ ] La catégorie apparaît dans la liste

### 3.5 Page Admin Commandes
- [ ] Aller sur http://localhost:3000/admin/commandes
- [ ] Les 4 commandes de test s'affichent
- [ ] Cliquer sur "Voir" pour une commande
- [ ] Les détails s'affichent (client, articles, total)
- [ ] Changer le statut avec le menu déroulant
- [ ] Le statut se met à jour

### 3.6 Page Admin Promotions
- [ ] Aller sur http://localhost:3000/admin/promotions
- [ ] Les 3 promotions s'affichent
- [ ] Cliquer sur le badge "Active/Inactive" pour changer le statut
- [ ] Cliquer sur "Modifier" pour éditer une promotion
- [ ] Créer une nouvelle promotion

## 🐛 Étape 4 : Vérifier les Erreurs

### 4.1 Console Navigateur
- [ ] Ouvrir la console (F12)
- [ ] Aller sur chaque page
- [ ] Vérifier qu'il n'y a pas d'erreurs rouges
- [ ] Les warnings jaunes sont OK

### 4.2 Console Terminal
- [ ] Vérifier le terminal où tourne `npm run dev`
- [ ] Pas d'erreurs de compilation
- [ ] Les requêtes Supabase passent (200 OK)

## 📱 Étape 5 : Tester les Fonctionnalités

### 5.1 Panier Complet
- [ ] Ajouter 3 produits différents au panier
- [ ] Aller au panier
- [ ] Modifier les quantités
- [ ] Supprimer un article
- [ ] Vider le panier
- [ ] Le panier se vide correctement

### 5.2 Filtres Catalogue
- [ ] Aller au catalogue
- [ ] Filtrer par "Robes"
- [ ] Seules les robes s'affichent
- [ ] Filtrer par prix (0 - 50000)
- [ ] Seuls les produits < 50k s'affichent
- [ ] Effacer les filtres
- [ ] Tous les produits réapparaissent

### 5.3 Recherche Commandes
- [ ] Aller dans admin/commandes
- [ ] Taper "Marie" dans la recherche
- [ ] Seule la commande de Marie s'affiche
- [ ] Filtrer par statut "En attente"
- [ ] Seules les commandes en attente s'affichent

## ✅ Résultat Final

### Si TOUT est coché ✅
🎉 **Félicitations !** Votre application est 100% fonctionnelle !

Vous pouvez maintenant :
1. Ajouter vos propres produits
2. Uploader vos vraies images
3. Personnaliser les catégories
4. Commencer à recevoir des commandes

### Si certains points ne fonctionnent pas ❌

#### Problème : Les produits ne s'affichent pas
**Solution :**
1. Vérifier que `insert_sample_data.sql` a été exécuté
2. Ouvrir la console (F12) et chercher les erreurs
3. Vérifier les politiques RLS dans Supabase

#### Problème : Erreur "relation does not exist"
**Solution :**
1. Exécuter `create.sql` dans Supabase SQL Editor
2. Redémarrer l'application

#### Problème : Images ne s'affichent pas
**Solution :**
1. Les images de test utilisent `/placeholder.jpg`
2. Créer un fichier `public/placeholder.jpg`
3. Ou remplacer par vos vraies images

#### Problème : Erreur de permission Supabase
**Solution :**
1. Aller dans Supabase → Authentication → Policies
2. Vérifier que les tables ont des politiques de lecture publique
3. Ajouter si nécessaire :
```sql
CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
```

## 📞 Besoin d'Aide ?

1. Consultez `DEMARRAGE_RAPIDE.md`
2. Consultez `SUPABASE_SETUP.md`
3. Consultez `RECAPITULATIF.md`
4. Vérifiez la console du navigateur (F12)
5. Vérifiez les logs Supabase

## 🎯 Prochaines Actions

Une fois que tout fonctionne :
- [ ] Supprimer les données de test
- [ ] Ajouter vos vrais produits
- [ ] Uploader vos vraies images
- [ ] Personnaliser les couleurs et le design
- [ ] Configurer le numéro WhatsApp
- [ ] Tester les commandes en réel
- [ ] Déployer sur Vercel

**Bonne chance ! 🚀**
