# 🛍️ FC Design - E-commerce Platform

Application e-commerce complète avec Next.js 14, Supabase et TypeScript.

## 🚀 Démarrage Rapide

### 1. Configuration Supabase (5 minutes)

```bash
# 1. Aller sur https://supabase.com/dashboard
# 2. Ouvrir SQL Editor
# 3. Exécuter setup_complete.sql (TOUT LE FICHIER)
```

### 2. Lancer l'Application

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000

## 📚 Documentation

- **[GUIDE_FINAL.md](./GUIDE_FINAL.md)** - Guide de démarrage en 5 minutes ⭐
- **[CHECKLIST.md](./CHECKLIST.md)** - Vérifier que tout fonctionne
- **[RECAPITULATIF.md](./RECAPITULATIF.md)** - Résumé des modifications

## ✨ Fonctionnalités

### Frontend Public
- 🏠 Page d'accueil avec produits vedettes
- 📦 Catalogue avec filtres (catégories, prix)
- 🔍 Page détail produit
- 🛒 Panier d'achat persistant
- 📝 Formulaire de commande
- 💬 Intégration WhatsApp

### Admin
- 📊 Dashboard avec statistiques
- 🏷️ Gestion produits (CRUD complet)
- 📁 Gestion catégories
- 📋 Gestion commandes (statuts, factures)
- 🎁 Gestion promotions
- 📤 Upload d'images

## 🗄️ Base de Données

### Tables Supabase
- `categories` - Catégories de produits
- `products` - Catalogue produits
- `orders` - Commandes clients
- `order_items` - Articles de commande
- `promotions` - Codes promo

### Données de Test
- ✅ 4 catégories
- ✅ 12 produits
- ✅ 4 commandes
- ✅ 3 promotions

## 🛠️ Technologies

- **Framework:** Next.js 14 (App Router)
- **Base de données:** Supabase (PostgreSQL)
- **UI:** Tailwind CSS + shadcn/ui
- **Langage:** TypeScript
- **État:** React Context API

## 📁 Structure du Projet

```
fc-design/
├── app/
│   ├── (public)/          # Pages publiques
│   │   ├── page.tsx       # Accueil
│   │   ├── catalogue/     # Catalogue
│   │   ├── produit/       # Détail produit
│   │   ├── panier/        # Panier
│   │   └── commande/      # Commande
│   └── admin/             # Pages admin
│       ├── produits/      # Gestion produits
│       ├── categories/    # Gestion catégories
│       ├── commandes/     # Gestion commandes
│       └── promotions/    # Gestion promotions
├── components/            # Composants réutilisables
├── lib/
│   ├── supabase.ts       # Client Supabase
│   ├── data.ts           # Fonctions de données
│   ├── types.ts          # Types TypeScript
│   └── cart-context.tsx  # Context panier
├── public/
│   └── uploads/          # Images uploadées
├── create.sql            # Création tables
└── insert_sample_data.sql # Données de test
```

## 🎯 Pages Disponibles

### Public
- `/` - Accueil
- `/catalogue` - Catalogue avec filtres
- `/produit/[id]` - Détail produit
- `/panier` - Panier
- `/commande` - Formulaire commande

### Admin
- `/admin` - Dashboard
- `/admin/produits` - Gestion produits
- `/admin/categories` - Gestion catégories
- `/admin/commandes` - Gestion commandes
- `/admin/promotions` - Gestion promotions

## 🔐 Configuration

### Variables d'Environnement (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://brvusrfaurzrshhhafof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

## 📦 Installation

```bash
# Cloner le projet
cd fc-design

# Installer les dépendances
npm install

# Configurer Supabase (voir DEMARRAGE_RAPIDE.md)

# Lancer en développement
npm run dev

# Build pour production
npm run build
npm start
```

## 🎨 Personnalisation

### Ajouter des Produits
1. Aller sur `/admin/produits`
2. Cliquer sur "Ajouter un produit"
3. Remplir le formulaire
4. Uploader une image
5. Sélectionner catégories et tailles

### Modifier les Catégories
1. Aller sur `/admin/categories`
2. Modifier ou créer des catégories
3. Ajouter des images

### Gérer les Commandes
1. Aller sur `/admin/commandes`
2. Voir les détails des commandes
3. Changer les statuts
4. Contacter les clients via WhatsApp
5. Générer des factures

## 🐛 Dépannage

### Les produits ne s'affichent pas
```bash
# Vérifier que les données sont dans Supabase
# Ouvrir la console (F12) pour voir les erreurs
# Vérifier les politiques RLS
```

### Erreur "relation does not exist"
```bash
# Exécuter create.sql dans Supabase SQL Editor
```

### Images ne s'affichent pas
```bash
# Les images de test utilisent /placeholder.jpg
# Créer ce fichier ou remplacer par vos images
```

## 📊 Schéma de Données

### Product
```typescript
{
  id: number
  name: string
  original_price: number
  description: string
  image: string
  sizes: string[]
  stock: number
  category_ids: string[]
}
```

### Category
```typescript
{
  id: string (UUID)
  name: string
  slug: string
  image: string
}
```

### Order
```typescript
{
  id: string (UUID)
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_method: 'livraison' | 'retrait'
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  order_items: OrderItem[]
}
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans Vercel Dashboard
```

### Autres Plateformes
- Netlify
- Railway
- Render

## 📞 Support

- WhatsApp: 0196422780
- Email: support@fcdesign.com

## 📝 Licence

MIT

## 🙏 Remerciements

- Next.js
- Supabase
- Tailwind CSS
- shadcn/ui

---

**Développé avec ❤️ pour FC Design**

Pour plus d'informations, consultez la documentation dans les fichiers :
- `DEMARRAGE_RAPIDE.md`
- `SUPABASE_SETUP.md`
- `CHECKLIST.md`
