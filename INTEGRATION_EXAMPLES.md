# Exemples d'intégration - Recherche

## Ajouter un lien vers la recherche

### Dans la page de liste (list.vue)

Ajoutez ce bouton dans l'en-tête :

```vue
<Button 
  label="Recherche avancée" 
  icon="pi pi-search-plus"
  severity="info"
  outlined
  @click="navigateTo('/documentation/search')"
/>
```

### Dans la page d'accueil (index.vue)

Ajoutez une carte pour la recherche :

```vue
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <!-- Carte Liste -->
  <Card @click="navigateTo('/documentation/list')">
    <template #header>
      <i class="pi pi-list text-4xl text-blue-500"></i>
    </template>
    <template #title>Toutes les docs</template>
    <template #content>
      <p>Voir toutes les documentations disponibles</p>
    </template>
  </Card>

  <!-- Carte Recherche -->
  <Card @click="navigateTo('/documentation/search')">
    <template #header>
      <i class="pi pi-search text-4xl text-green-500"></i>
    </template>
    <template #title>Rechercher</template>
    <template #content>
      <p>Recherche avancée avec filtres</p>
    </template>
  </Card>

  <!-- Carte Nouveau -->
  <Card @click="navigateTo('/documentation')">
    <template #header>
      <i class="pi pi-plus text-4xl text-purple-500"></i>
    </template>
    <template #title>Créer</template>
    <template #content>
      <p>Créer une nouvelle documentation</p>
    </template>
  </Card>
</div>
```

## Créer un layout avec menu de navigation

### Fichier : app/layouts/default.vue

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <i class="pi pi-book text-2xl text-primary-600"></i>
            <span class="text-xl font-bold text-gray-900">Open Docs</span>
          </NuxtLink>

          <!-- Navigation principale -->
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink 
              to="/documentation/list"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              active-class="bg-primary-100 text-primary-700 font-semibold"
            >
              <i class="pi pi-list mr-2"></i>
              Liste
            </NuxtLink>
            
            <NuxtLink 
              to="/documentation/search"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              active-class="bg-primary-100 text-primary-700 font-semibold"
            >
              <i class="pi pi-search mr-2"></i>
              Recherche
            </NuxtLink>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <Button 
              icon="pi pi-search"
              rounded
              text
              @click="navigateTo('/documentation/search')"
              v-tooltip.bottom="'Rechercher (Ctrl+K)'"
              class="md:hidden"
            />
            <Button 
              label="Nouveau" 
              icon="pi pi-plus"
              size="small"
              @click="navigateTo('/documentation')"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="pb-12">
      <slot />
    </main>

    <!-- Toast container -->
    <Toast position="top-right" />
  </div>
</template>

<script setup lang="ts">
// Raccourci clavier global
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl+K ou Cmd+K pour ouvrir la recherche
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      navigateTo('/documentation/search')
    }
  }
  
  document.addEventListener('keydown', handleKeyPress)
  
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyPress)
  })
})
</script>
```

### Utiliser le layout dans app.vue

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Barre de recherche compacte dans l'en-tête

Pour une recherche rapide sans quitter la page :

```vue
<template>
  <div class="search-header">
    <!-- Version compacte du SearchBar -->
    <div class="relative max-w-md">
      <input
        v-model="quickSearch"
        type="text"
        placeholder="Recherche rapide..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        @keydown.enter="handleQuickSearch"
        @focus="showQuickSuggestions = true"
      />
      <i class="pi pi-search absolute left-3 top-3 text-gray-400"></i>
      
      <!-- Suggestions rapides -->
      <div 
        v-if="showQuickSuggestions && quickSuggestions.length > 0"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50"
      >
        <button
          v-for="suggestion in quickSuggestions"
          :key="suggestion.id"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          @click="navigateTo(`/documentation/${suggestion.id}`)"
        >
          <div class="font-medium text-gray-900">{{ suggestion.title }}</div>
          <div class="text-sm text-gray-500 line-clamp-1">{{ suggestion.content }}</div>
        </button>
        
        <button
          class="w-full text-center px-4 py-3 text-primary-600 font-medium hover:bg-primary-50"
          @click="navigateTo('/documentation/search')"
        >
          Voir tous les résultats →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const quickSearch = ref('')
const showQuickSuggestions = ref(false)
const quickSuggestions = ref<any[]>([])

const fetchQuickSuggestions = useDebounceFn(async () => {
  if (!quickSearch.value) {
    quickSuggestions.value = []
    return
  }
  
  try {
    const response = await $fetch(`/api/documentation/search?q=${quickSearch.value}&limit=5`)
    if (response.success) {
      quickSuggestions.value = response.data
    }
  } catch (error) {
    console.error('Quick search error:', error)
  }
}, 300)

const handleQuickSearch = () => {
  navigateTo(`/documentation/search?q=${encodeURIComponent(quickSearch.value)}`)
}

watch(quickSearch, () => {
  if (quickSearch.value.length > 0) {
    fetchQuickSuggestions()
  } else {
    quickSuggestions.value = []
  }
})

// Fermer les suggestions au clic extérieur
onClickOutside(searchHeaderRef, () => {
  showQuickSuggestions.value = false
})
</script>
```

## Widget de recherche pour le dashboard

```vue
<template>
  <Card class="search-widget">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="pi pi-search text-primary-600"></i>
        Recherche rapide
      </div>
    </template>
    <template #content>
      <div class="space-y-3">
        <!-- Champ de recherche -->
        <InputText 
          v-model="searchTerm"
          placeholder="Rechercher une documentation..."
          class="w-full"
          @keydown.enter="goToSearch"
        />
        
        <!-- Recherches récentes -->
        <div v-if="recentSearches.length > 0" class="space-y-2">
          <p class="text-xs font-semibold text-gray-500 uppercase">Récentes</p>
          <div class="flex flex-wrap gap-2">
            <Chip
              v-for="(search, index) in recentSearches"
              :key="index"
              :label="search"
              class="cursor-pointer hover:bg-primary-100"
              @click="searchTerm = search; goToSearch()"
            />
          </div>
        </div>
        
        <!-- Actions rapides -->
        <div class="flex gap-2 pt-2">
          <Button 
            label="Recherche avancée"
            icon="pi pi-filter"
            size="small"
            outlined
            class="flex-1"
            @click="navigateTo('/documentation/search')"
          />
          <Button 
            label="Rechercher"
            icon="pi pi-arrow-right"
            size="small"
            class="flex-1"
            @click="goToSearch"
            :disabled="!searchTerm"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
const searchTerm = ref('')
const recentSearches = ref<string[]>([])

onMounted(() => {
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved).slice(0, 5)
  }
})

const goToSearch = () => {
  if (searchTerm.value.trim()) {
    navigateTo(`/documentation/search?q=${encodeURIComponent(searchTerm.value)}`)
  }
}
</script>
```

## Intégrer la recherche dans la page de détail

Ajouter "Rechercher des docs similaires" :

```vue
<!-- Dans [id].vue -->
<template>
  <div>
    <!-- Contenu de la doc -->
    
    <!-- Section "Docs similaires" -->
    <Card class="mt-8">
      <template #title>Documentations similaires</template>
      <template #content>
        <div v-if="similarDocs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentationCard 
            v-for="doc in similarDocs"
            :key="doc.id"
            :documentation="doc"
            @click="navigateTo(`/documentation/${doc.id}`)"
          />
        </div>
        
        <div class="text-center mt-4">
          <Button 
            label="Rechercher d'autres docs"
            icon="pi pi-search"
            text
            @click="searchSimilar"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const currentDoc = ref<any>(null)
const similarDocs = ref<any[]>([])

onMounted(async () => {
  // Charger la doc actuelle
  currentDoc.value = await loadCurrentDoc()
  
  // Rechercher des docs similaires basées sur les outils ou marques
  if (currentDoc.value?.tools?.length > 0) {
    const toolNames = currentDoc.value.tools.map(t => t.name).join(' ')
    const response = await $fetch(`/api/documentation/search?q=${toolNames}&limit=4`)
    if (response.success) {
      similarDocs.value = response.data.filter(d => d.id !== currentDoc.value.id)
    }
  }
})

const searchSimilar = () => {
  const tools = currentDoc.value?.tools?.map(t => t.name).join(' ') || ''
  navigateTo(`/documentation/search?q=${encodeURIComponent(tools)}`)
}
</script>
```

## Menu contextuel avec recherche

```vue
<template>
  <SpeedDial 
    :model="menuItems" 
    direction="up"
    :style="{ position: 'fixed', bottom: '2rem', right: '2rem' }"
  />
</template>

<script setup lang="ts">
const menuItems = [
  {
    label: 'Rechercher',
    icon: 'pi pi-search',
    command: () => navigateTo('/documentation/search')
  },
  {
    label: 'Liste',
    icon: 'pi pi-list',
    command: () => navigateTo('/documentation/list')
  },
  {
    label: 'Nouveau',
    icon: 'pi pi-plus',
    command: () => navigateTo('/documentation')
  }
]
</script>
```

## Pré-remplir la recherche depuis une autre page

```vue
<!-- Depuis n'importe où -->
<Button 
  :label="`Rechercher "${brand}"`"
  icon="pi pi-search"
  @click="navigateTo(`/documentation/search?q=${encodeURIComponent(brand)}`)"
/>
```

Puis dans `search.vue`, lisez les query params :

```vue
<script setup lang="ts">
const route = useRoute()

onMounted(() => {
  // Pré-remplir la recherche si query param existe
  if (route.query.q) {
    currentQuery.value = route.query.q as string
    handleSearch(currentQuery.value, {})
  }
})
</script>
```

## Utiliser uniquement le composant SearchBar

Si vous voulez juste la barre de recherche sans toute la page :

```vue
<template>
  <div class="container">
    <SearchBar 
      @search="handleSearch"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import SearchBar from '~/components/SearchBar.vue'

const handleSearch = (query: string, filters: any) => {
  console.log('Recherche:', query, filters)
  // Faire quelque chose avec les résultats
}

const handleSelect = (suggestion: any) => {
  console.log('Sélection:', suggestion)
  navigateTo(`/documentation/${suggestion.id}`)
}
</script>
```

## Notes

- Tous ces exemples sont prêts à l'emploi
- Copiez-collez le code dans vos fichiers
- Adaptez les classes CSS selon vos besoins
- Les composants PrimeVue sont auto-importés par Nuxt

