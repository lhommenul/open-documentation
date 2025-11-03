# Mode Alpha - Documentation

## Vue d'ensemble

Le mode alpha permet de restreindre l'accès de l'application à la page d'accueil uniquement. Cette fonctionnalité est utile lors du lancement initial de l'application en production, permettant de présenter le projet sans donner accès à toutes les fonctionnalités.

## Architecture

### 1. Base de données

Le statut du mode alpha est stocké dans la collection `AppConfig` de MongoDB avec la structure suivante :

```typescript
{
  key: 'alphaMode',
  value: true | false,
  description: 'Mode alpha - limite l\'accès à la page d\'accueil uniquement',
  updatedAt: Date
}
```

**Modèle :** `server/models/AppConfig.ts`

### 2. API Endpoints

#### GET `/api/config/app`
Récupère la configuration actuelle du mode alpha.

**Response :**
```json
{
  "alphaMode": true,
  "updatedAt": "2025-11-03T10:00:00.000Z"
}
```

#### PUT `/api/config/app`
Met à jour le statut du mode alpha.

**Body :**
```json
{
  "alphaMode": true
}
```

**Response :**
```json
{
  "alphaMode": true,
  "updatedAt": "2025-11-03T10:00:00.000Z",
  "message": "Configuration updated successfully"
}
```

### 3. Composable

**Fichier :** `app/composables/useAlphaMode.ts`

Le composable `useAlphaMode` fournit une interface réactive pour gérer le mode alpha :

```typescript
const { 
  alphaMode,       // Computed<boolean> - État actuel du mode alpha
  loading,         // Computed<boolean> - État de chargement
  error,           // Computed<Error | null> - Erreur éventuelle
  fetchAlphaMode,  // () => Promise<boolean> - Récupère le statut
  updateAlphaMode  // (value: boolean) => Promise<void> - Met à jour le statut
} = useAlphaMode();
```

### 4. Middleware Global

**Fichier :** `app/middleware/alpha.global.ts`

Le middleware s'exécute automatiquement sur toutes les routes et redirige vers la page d'accueil si :
- Le mode alpha est activé
- L'utilisateur tente d'accéder à une page autre que `/`

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') return;
  
  const { alphaMode, fetchAlphaMode } = useAlphaMode();
  
  if (alphaMode.value === undefined) {
    await fetchAlphaMode();
  }
  
  if (alphaMode.value === true) {
    return navigateTo('/');
  }
});
```

## Utilisation

### Dans un composant Vue

```vue
<template>
  <div>
    <Button 
      v-if="!alphaMode"
      label="Créer une documentation" 
      @click="navigateTo('/documentation')"
    />
    <span v-if="alphaMode" class="text-yellow-600">
      🚧 Application en mode alpha
    </span>
  </div>
</template>

<script setup lang="ts">
const { alphaMode, fetchAlphaMode } = useAlphaMode();

onMounted(async () => {
  await fetchAlphaMode();
});
</script>
```

### Page d'administration

Une page d'administration est disponible à `/admin/config` pour gérer facilement le mode alpha via une interface graphique.

**Fonctionnalités :**
- Toggle pour activer/désactiver le mode alpha
- Indication visuelle de l'état actuel
- Messages de confirmation
- Gestion des erreurs

## Configuration initiale

Par défaut, le mode alpha est **activé** (`true`) lors de la première utilisation. Pour changer cela :

1. **Via l'interface d'administration :**
   - Accédez à `/admin/config`
   - Utilisez le toggle pour désactiver le mode alpha

2. **Via l'API directement :**
   ```bash
   curl -X PUT http://localhost:3000/api/config/app \
     -H "Content-Type: application/json" \
     -d '{"alphaMode": false}'
   ```

3. **Via MongoDB directement :**
   ```javascript
   db.appconfigs.updateOne(
     { key: 'alphaMode' },
     { $set: { value: false } },
     { upsert: true }
   );
   ```

## Comportement

### Quand le mode alpha est activé (`alphaMode: true`)

✅ **Accessible :**
- Page d'accueil (`/`)
- Page d'administration (`/admin/config`)

❌ **Non accessible (redirection vers `/`):**
- `/documentation`
- `/documentation/list`
- `/documentation/read/:id`
- Toutes les autres pages

### Quand le mode alpha est désactivé (`alphaMode: false`)

✅ Toutes les pages sont accessibles normalement

## Recommandations

1. **Lancement en production :** Activez le mode alpha pour présenter l'application sans donner accès complet
2. **Tests :** Désactivez le mode alpha en environnement de développement
3. **Communication :** Affichez clairement sur la page d'accueil que l'application est en mode alpha
4. **Monitoring :** Surveillez les tentatives d'accès aux pages restreintes pour comprendre l'intérêt des utilisateurs

## Sécurité

⚠️ **Important :** Le mode alpha n'est pas un système d'authentification. Il s'agit simplement d'une restriction d'accès côté client. Pour une sécurité complète :

1. Ajoutez une authentification appropriée
2. Protégez les API endpoints sensibles
3. Validez les permissions côté serveur

## Désactivation du mode alpha

Pour désactiver complètement le système de mode alpha :

1. Supprimez le middleware : `app/middleware/alpha.global.ts`
2. Retirez les conditions `v-if="!alphaMode"` des composants
3. (Optionnel) Supprimez le composable et les pages d'administration associées

