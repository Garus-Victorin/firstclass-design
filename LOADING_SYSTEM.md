# Système de Loading

## 🎨 Design du Loader

Le loader affiche :
- **Logo centré** - Logo de l'application
- **Nom "FIRST CLASS DESIGN"** en orange avec soulignement
- **5 points animés** - Animation bounce séquentielle
- **Messages dynamiques** - Changent toutes les 2 secondes

## 🚀 Fonctionnement

### 1. Chargement initial (1.5s)
Lors du premier chargement de l'application

### 2. Chargement de route (0.5s)
Lors de la navigation entre les pages

### 3. Lazy Loading
Next.js charge automatiquement le loader pour les pages avec `loading.tsx`

## 📝 Utilisation

### Automatique
Le loader s'affiche automatiquement lors :
- Du chargement initial de l'app
- De la navigation entre pages
- Du lazy loading des composants

### Manuel
Pour déclencher le loader manuellement :

```tsx
import { useLoader } from '@/lib/use-loader'

function MyComponent() {
  const { showLoader, hideLoader } = useLoader()

  const handleAction = async () => {
    showLoader()
    
    // Votre action asynchrone
    await fetchData()
    
    hideLoader()
  }

  return <button onClick={handleAction}>Action</button>
}
```

## 📁 Fichiers

- `components/loader.tsx` - Composant du loader
- `components/loading-provider.tsx` - Provider de contexte
- `app/loading.tsx` - Loading global
- `app/(public)/loading.tsx` - Loading pages publiques
- `app/admin/loading.tsx` - Loading pages admin
- `lib/use-loader.ts` - Hook personnalisé

## 🎯 Messages de chargement

Les messages affichés :
1. "Veuillez patienter..."
2. "Page en cours de chargement..."
3. "Préparation de votre expérience..."
4. "Chargement des données..."
5. "Presque prêt..."

Pour modifier les messages, éditez le tableau `loadingMessages` dans `components/loader.tsx`.

## ⚙️ Configuration

### Durées
- Chargement initial : 1500ms
- Chargement de route : 500ms
- Changement de message : 2000ms

Pour modifier, éditez `components/loading-provider.tsx`.

### Animations
Les animations sont définies dans `app/globals.css` :
- `animate-bounce` - Points qui rebondissent
- `animate-fade-in` - Apparition du message

## 🎨 Personnalisation

### Couleurs
Le loader utilise la couleur orange (`text-orange-500`, `bg-orange-500`).
Pour changer, modifiez les classes Tailwind dans `components/loader.tsx`.

### Points
Nombre de points : 5
Pour modifier, changez le tableau `[0, 1, 2, 3, 4]` dans le composant.

### Délai d'animation
Chaque point a un délai de 0.15s.
Pour modifier : `animationDelay: ${index * 0.15}s`
