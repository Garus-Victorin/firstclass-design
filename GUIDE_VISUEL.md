# 🎯 Guide Visuel - Configuration en 3 Étapes

## 📋 Avant de Commencer

Vous avez besoin de :
- ✅ Node.js installé
- ✅ Compte Supabase (gratuit)
- ✅ Ce projet téléchargé

---

## 🚀 ÉTAPE 1 : Configuration Supabase (5 min)

### 1.1 Ouvrir Supabase
```
🌐 https://supabase.com/dashboard
   ↓
📁 Sélectionner votre projet : brvusrfaurzrshhhafof
   ↓
💾 Cliquer sur "SQL Editor" (menu gauche)
```

### 1.2 Créer les Tables
```
📝 Dans SQL Editor :
   ↓
📄 Ouvrir le fichier : create.sql
   ↓
📋 Copier TOUT le contenu
   ↓
📥 Coller dans SQL Editor
   ↓
▶️ Cliquer sur "Run" (ou Ctrl+Enter)
   ↓
✅ Attendre "Success"
```

### 1.3 Insérer les Données
```
📝 Dans SQL Editor :
   ↓
➕ Cliquer sur "+ New query"
   ↓
📄 Ouvrir le fichier : insert_sample_data.sql
   ↓
📋 Copier TOUT le contenu
   ↓
📥 Coller dans SQL Editor
   ↓
▶️ Cliquer sur "Run"
   ↓
✅ Voir le résultat :
   Catégories: 4
   Produits: 12
   Promotions: 3
   Commandes: 4
   Articles commande: 10
```

### 1.4 Vérifier (Optionnel)
```
📝 Dans SQL Editor :
   ↓
➕ Nouvelle requête
   ↓
📄 Ouvrir : verify_database.sql
   ↓
▶️ Run
   ↓
✅ Tout doit être marqué "✅ OK"
```

---

## 💻 ÉTAPE 2 : Lancer l'Application (2 min)

### 2.1 Ouvrir le Terminal
```
📁 Aller dans le dossier du projet :
   cd c:\Users\Victorin\Downloads\Compressed\fc-design
```

### 2.2 Installer les Dépendances (si pas déjà fait)
```bash
npm install
```

### 2.3 Démarrer le Serveur
```bash
npm run dev
```

### 2.4 Ouvrir le Navigateur
```
🌐 http://localhost:3000
```

---

## ✅ ÉTAPE 3 : Vérifier que Tout Fonctionne (3 min)

### 3.1 Page d'Accueil
```
🏠 http://localhost:3000
   ↓
✅ Voir les produits dans "Nouveautés"
✅ Voir les 4 catégories
✅ Les prix s'affichent en FCFA
```

### 3.2 Catalogue
```
📦 http://localhost:3000/catalogue
   ↓
✅ Voir "12 produits"
✅ Filtrer par catégorie "Robes"
✅ Trier par prix
```

### 3.3 Page Produit
```
🔍 Cliquer sur un produit
   ↓
✅ Voir les détails
✅ Sélectionner une taille
✅ Ajouter au panier
```

### 3.4 Panier
```
🛒 http://localhost:3000/panier
   ↓
✅ Voir le produit ajouté
✅ Modifier la quantité
✅ Voir le total
```

### 3.5 Admin Produits
```
🔧 http://localhost:3000/admin/produits
   ↓
✅ Voir les 12 produits en grille
✅ Cliquer sur "Voir" pour les détails
✅ Cliquer sur "Modifier"
```

### 3.6 Admin Catégories
```
📁 http://localhost:3000/admin/categories
   ↓
✅ Voir les 4 catégories
✅ Modifier une catégorie
✅ Créer une nouvelle catégorie
```

### 3.7 Admin Commandes
```
📋 http://localhost:3000/admin/commandes
   ↓
✅ Voir les 4 commandes de test
✅ Cliquer sur "Voir" pour les détails
✅ Changer le statut
```

### 3.8 Admin Promotions
```
🎁 http://localhost:3000/admin/promotions
   ↓
✅ Voir les 3 promotions
✅ Activer/Désactiver une promotion
✅ Créer une nouvelle promotion
```

---

## 🎉 C'EST PRÊT !

Si tout fonctionne, vous avez maintenant :

```
✅ Base de données Supabase configurée
✅ 4 catégories (Robes, Hauts, Pantalons, Accessoires)
✅ 12 produits avec prix et stock
✅ 4 commandes de test
✅ 3 promotions
✅ Interface admin complète
✅ Frontend public avec panier
✅ Système de commandes
```

---

## 🎨 Prochaines Étapes

### Personnaliser Votre Boutique

#### 1. Ajouter Vos Produits
```
🔧 http://localhost:3000/admin/produits
   ↓
➕ Cliquer "Ajouter un produit"
   ↓
📝 Remplir le formulaire
   ↓
📸 Uploader une image
   ↓
✅ Créer
```

#### 2. Modifier les Catégories
```
📁 http://localhost:3000/admin/categories
   ↓
✏️ Modifier les noms
   ↓
🖼️ Ajouter des images
```

#### 3. Supprimer les Données de Test
```
💾 Supabase SQL Editor
   ↓
📝 Exécuter :
   DELETE FROM order_items;
   DELETE FROM orders;
   DELETE FROM products WHERE id <= 12;
   DELETE FROM promotions WHERE code IN ('HIVER20', 'BIENVENUE', 'VIP15');
```

#### 4. Configurer WhatsApp
```
📄 Ouvrir : lib/data.ts
   ↓
🔍 Chercher : WHATSAPP_NUMBER
   ↓
✏️ Remplacer par votre numéro
```

---

## 🐛 Problèmes Courants

### ❌ Les produits ne s'affichent pas
```
Solution :
1. Vérifier que insert_sample_data.sql a été exécuté
2. Ouvrir la console (F12) pour voir les erreurs
3. Vérifier dans Supabase Table Editor que les données existent
```

### ❌ Erreur "relation does not exist"
```
Solution :
1. Exécuter create.sql dans Supabase SQL Editor
2. Redémarrer npm run dev
```

### ❌ Images ne s'affichent pas
```
Solution :
1. Les images de test utilisent /placeholder.jpg
2. Créer ce fichier dans public/
3. Ou remplacer par vos vraies images
```

### ❌ Erreur de permission Supabase
```
Solution :
1. Aller dans Supabase → Authentication → Policies
2. Vérifier que products et categories ont des politiques publiques
3. Exécuter dans SQL Editor :
   CREATE POLICY "Public read" ON products FOR SELECT USING (true);
   CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- 📖 **README.md** - Vue d'ensemble du projet
- 🚀 **DEMARRAGE_RAPIDE.md** - Guide détaillé
- 🗄️ **SUPABASE_SETUP.md** - Configuration Supabase
- ✅ **CHECKLIST.md** - Liste de vérification
- 📋 **RECAPITULATIF.md** - Résumé des modifications

---

## 📞 Besoin d'Aide ?

1. Consultez la documentation ci-dessus
2. Vérifiez la console du navigateur (F12)
3. Vérifiez les logs Supabase
4. Contactez le support

---

## 🎊 Félicitations !

Vous avez maintenant une boutique e-commerce complète et fonctionnelle !

**Bon développement ! 🚀**
