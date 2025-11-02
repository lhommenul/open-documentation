# Guide de Navigation

## Structure des Pages

### Pages principales

1. **Page d'accueil** : `/`
   - Point d'entrée de l'application
   - Vue d'ensemble

2. **Liste des documentations** : `/documentation/list`
   - Affiche toutes les documentations
   - Tri et pagination
   - Actions rapides

3. **Recherche** : `/documentation/search` ⭐ NOUVEAU
   - Recherche avancée avec filtres
   - Suggestions en temps réel
   - Affichage en grille ou liste

4. **Créer/Éditer une documentation** : `/documentation` ou `/documentation/[id]`
   - Formulaire de création/édition
   - Upload d'images
   - Gestion des outils

5. **Vue détaillée** : `/documentation/[id]/view`
   - Affichage complet d'une documentation
   - Vue lecture seule

## Navigation entre les pages

### Depuis la page d'accueil

```
/ (Accueil)
├── Clic "Voir les documentations" → /documentation/list
├── Clic "Rechercher" → /documentation/search
└── Clic "Nouvelle documentation" → /documentation
```

### Depuis la liste des documentations

```
/documentation/list
├── Barre de recherche locale (intégrée)
├── Bouton "Recherche avancée" → /documentation/search
├── Clic sur une carte → /documentation/[id]
├── Bouton "Nouvelle Documentation" → /documentation
└── Actions sur les cartes:
    ├── Éditer → /documentation/[id]
    └── Supprimer → Confirmation + suppression
```

### Depuis la page de recherche

```
/documentation/search
├── Bouton "Retour" → /documentation/list
├── Clic sur un résultat → /documentation/[id]
├── Bouton "Nouvelle Documentation" → /documentation
└── Actions sur les résultats:
    ├── Voir → /documentation/[id]
    ├── Éditer → /documentation/[id]
    └── Supprimer → Confirmation + suppression
```

## Liens recommandés à ajouter

Pour améliorer la navigation, vous pourriez ajouter :

### 1. Dans l'en-tête principal (app.vue ou layout/default.vue)

```vue
<nav>
  <NuxtLink to="/">Accueil</NuxtLink>
  <NuxtLink to="/documentation/list">Documentations</NuxtLink>
  <NuxtLink to="/documentation/search">Rechercher</NuxtLink>
  <NuxtLink to="/documentation">Nouveau</NuxtLink>
</nav>
```

### 2. Dans la page de liste (/documentation/list.vue)

Ajoutez un bouton pour accéder à la recherche avancée :

```vue
<Button 
  label="Recherche avancée" 
  icon="pi pi-search-plus"
  @click="navigateTo('/documentation/search')"
/>
```

### 3. Raccourci clavier (optionnel)

Dans app.vue, ajoutez un raccourci global :

```vue
<script setup>
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      navigateTo('/documentation/search')
    }
  })
})
</script>
```

## Flux utilisateur typiques

### Flux 1 : Rechercher une documentation existante

1. Utilisateur arrive sur `/`
2. Clique sur "Rechercher" → `/documentation/search`
3. Tape un terme de recherche
4. Voit les suggestions en temps réel
5. Applique des filtres si nécessaire
6. Clique sur un résultat → `/documentation/[id]`

### Flux 2 : Créer une nouvelle documentation

1. Utilisateur est sur `/documentation/search`
2. Recherche un terme (ex: "iPhone 16")
3. Aucun résultat trouvé
4. Clique sur "Créer une documentation" → `/documentation?title=iPhone%2016`
5. Remplit le formulaire
6. Sauvegarde

### Flux 3 : Navigation rapide

1. Utilisateur utilise `Ctrl+K` (si implémenté)
2. Modal de recherche s'ouvre
3. Tape et sélectionne → Navigation directe

## Structure des URLs

```
/                                    # Accueil
├── /documentation/                  # Formulaire de création
├── /documentation/list              # Liste de toutes les docs
├── /documentation/search            # Page de recherche ⭐ NOUVEAU
└── /documentation/:id               # Documentation spécifique
    ├── /documentation/:id           # Mode édition
    └── /documentation/:id/view      # Mode lecture (si implémenté)
```

## Améliorations suggérées

1. **Breadcrumb** : Ajouter un fil d'Ariane
   ```
   Accueil > Documentations > Recherche > [Titre du résultat]
   ```

2. **Menu latéral** : Navigation persistante
   - Accueil
   - Liste
   - Recherche
   - Favoris (à implémenter)

3. **Historique de navigation** : Boutons précédent/suivant

4. **Liens contextuels** : 
   - "Voir les documentations similaires"
   - "Rechercher des docs avec les mêmes outils"

## Exemple de layout avec navigation

Créez ou modifiez `app/layouts/default.vue` :

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              📚 Open Documentation
            </NuxtLink>
            <div class="flex gap-4">
              <NuxtLink to="/documentation/list" class="text-gray-600 hover:text-primary-600">
                Liste
              </NuxtLink>
              <NuxtLink to="/documentation/search" class="text-gray-600 hover:text-primary-600">
                Recherche
              </NuxtLink>
            </div>
          </div>
          <Button 
            label="Nouveau" 
            icon="pi pi-plus"
            @click="navigateTo('/documentation')"
          />
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main>
      <slot />
    </main>

    <!-- Toast Container -->
    <Toast />
  </div>
</template>
```

Puis dans `app.vue` :

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Notes

- Les URLs sont RESTful et descriptives
- La navigation est cohérente entre les pages
- Les boutons "Retour" sont présents sur les pages de détail
- Les actions destructives (suppression) nécessitent une confirmation

