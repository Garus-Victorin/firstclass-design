# 📢 Guide d'intégration Google AdSense

## ✅ Installation effectuée

Le script Google AdSense a été intégré dans `app/layout.tsx` avec votre ID : `ca-pub-2453811891801523`

## 🎯 Comment afficher des publicités

### 1. Obtenir un slot ID depuis Google AdSense

1. Connectez-vous à [Google AdSense](https://www.google.com/adsense/)
2. Allez dans **Annonces** → **Par unité publicitaire**
3. Créez une nouvelle unité publicitaire
4. Copiez le **data-ad-slot** (exemple: `1234567890`)

### 2. Utiliser le composant AdSense

```tsx
import { AdSense } from '@/components/adsense'

// Dans votre page ou composant
<AdSense 
  adSlot="VOTRE_SLOT_ID" 
  adFormat="auto"
  className="my-4"
/>
```

## 📍 Emplacements recommandés

### Page d'accueil (`app/(public)/page.tsx`)

```tsx
// Après la section Hero
<AdSense adSlot="SLOT_ID_1" className="my-8" />

// Entre les sections
<AdSense adSlot="SLOT_ID_2" className="my-8" />

// Avant le footer
<AdSense adSlot="SLOT_ID_3" className="my-8" />
```

### Page Catalogue (`app/(public)/catalogue/page.tsx`)

```tsx
// En haut de la page
<AdSense adSlot="SLOT_ID_4" className="mb-6" />

// Entre les produits (tous les 6 produits)
<AdSense adSlot="SLOT_ID_5" className="col-span-full my-4" />
```

### Page Produit (`app/(public)/produit/[id]/page.tsx`)

```tsx
// Sous les détails du produit
<AdSense adSlot="SLOT_ID_6" className="my-6" />

// Sidebar (si vous en avez une)
<AdSense adSlot="SLOT_ID_7" adFormat="vertical" />
```

## 🎨 Formats disponibles

- `auto` : Adaptatif (recommandé)
- `fluid` : S'adapte au conteneur
- `rectangle` : Format carré
- `vertical` : Bannière verticale
- `horizontal` : Bannière horizontale

## ⚙️ Options du composant

```tsx
<AdSense 
  adSlot="1234567890"              // Obligatoire
  adFormat="auto"                   // Optionnel (défaut: 'auto')
  fullWidthResponsive={true}        // Optionnel (défaut: true)
  className="my-4"                  // Optionnel
/>
```

## 🚀 Exemple complet

```tsx
import { AdSense } from '@/components/adsense'

export default function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Publicité après le hero */}
      <AdSense 
        adSlot="1234567890" 
        adFormat="horizontal"
        className="my-8 max-w-7xl mx-auto px-4"
      />
      
      <FeaturedProducts />
      
      {/* Publicité entre les sections */}
      <AdSense 
        adSlot="0987654321" 
        className="my-8"
      />
      
      <ReviewSection />
    </>
  )
}
```

## ⚠️ Important

1. **Validation du compte** : Google AdSense doit valider votre site (peut prendre 1-2 semaines)
2. **Politique de contenu** : Respectez les [règles AdSense](https://support.google.com/adsense/answer/48182)
3. **Ne pas cliquer** : Ne cliquez jamais sur vos propres annonces
4. **Limite d'annonces** : Maximum 3 annonces par page recommandé
5. **Performance** : Les annonces peuvent ralentir le chargement, utilisez-les avec modération

## 🔍 Vérification

Pour vérifier que AdSense fonctionne :

1. Déployez votre site en production
2. Ouvrez la console du navigateur (F12)
3. Cherchez les erreurs liées à `adsbygoogle`
4. Attendez que Google valide votre site

## 📊 Suivi des revenus

Consultez votre tableau de bord AdSense pour :
- Revenus estimés
- Impressions
- Clics
- CTR (taux de clics)

## 🛠️ Dépannage

### Les annonces ne s'affichent pas

1. Vérifiez que votre compte AdSense est approuvé
2. Vérifiez le slot ID
3. Attendez 24-48h après l'intégration
4. Vérifiez la console pour les erreurs

### Annonces vides

- Normal en développement local
- Testez en production sur votre domaine

### Erreurs de politique

- Vérifiez le contenu de votre site
- Consultez les notifications AdSense
