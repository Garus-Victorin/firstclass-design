# 🚀 DÉMARRAGE ULTRA RAPIDE

## 1️⃣ Supabase (2 minutes)

1. Ouvrir https://supabase.com/dashboard
2. Cliquer sur **SQL Editor**
3. Cliquer sur **+ New query**
4. Ouvrir le fichier **`setup_complete.sql`**
5. Copier TOUT le contenu (Ctrl+A, Ctrl+C)
6. Coller dans Supabase (Ctrl+V)
7. Cliquer sur **Run** (ou Ctrl+Enter)

✅ Vous devez voir :
```
Catégories: 4 ✅ OK
Produits: 12 ✅ OK
Promotions: 3 ✅ OK
Commandes: 4 ✅ OK
Articles commande: 10 ✅ OK
```

## 2️⃣ Application (1 minute)

```bash
npm run dev
```

## 3️⃣ Tester

Ouvrir http://localhost:3000

✅ Vous devez voir 12 produits sur la page d'accueil

---

## 🎯 Pages à Tester

### Public
- http://localhost:3000 - Accueil
- http://localhost:3000/catalogue - Catalogue
- http://localhost:3000/produit/1 - Détail produit

### Admin
- http://localhost:3000/admin/produits - Produits
- http://localhost:3000/admin/categories - Catégories
- http://localhost:3000/admin/commandes - Commandes

---

## ❌ Problème ?

### Les produits ne s'affichent pas
1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. Vérifier que `setup_complete.sql` a bien été exécuté

### Erreur "column does not exist"
Exécuter d'abord `create_products.sql` puis `setup_complete.sql`

---

## 📚 Plus d'Infos

- **GUIDE_FINAL.md** - Guide complet
- **CHECKLIST.md** - Vérification détaillée
- **RESUME_FINAL.md** - Résumé technique

---

**C'est tout ! Votre application est prête ! 🎉**
