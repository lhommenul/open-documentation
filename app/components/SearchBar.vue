<template>
    <div class="relative w-full" ref="searchBarRef">
      <!-- Main Search Container -->
      <div 
        class="bg-white rounded-xl shadow-lg border-2 transition-all duration-300"
        :class="[
          isFocused ? 'border-primary-500 shadow-xl' : 'border-gray-200',
          isExpanded ? 'rounded-b-none' : ''
        ]"
      >
        <!-- Search Input Row -->
        <div class="flex items-center gap-3 p-4">
          <i 
            class="pi pi-search text-xl transition-colors duration-300"
            :class="isFocused ? 'text-primary-600' : 'text-gray-400'"
          ></i>
          
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par titre, contenu, marque, outil..."
            class="flex-1 text-lg outline-none text-gray-900 placeholder-gray-400"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            @keydown.down.prevent="navigateSuggestions('down')"
            @keydown.up.prevent="navigateSuggestions('up')"
            @keydown.enter="selectCurrentSuggestion"
            @keydown.esc="closeSuggestions"
          />
  
          <!-- Quick Filters Chips -->
          <div v-if="!isFocused && activeFilters.length > 0" class="flex items-center gap-2">
            <Chip
              v-for="filter in activeFilters"
              :key="filter.key"
              :label="`${filter.label}: ${filter.value}`"
              removable
              class="bg-primary-50 text-primary-700"
              @remove="removeFilter(filter.key)"
            />
          </div>
  
          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <Button
              v-if="searchQuery"
              icon="pi pi-times"
              text
              rounded
              @click="clearSearch"
              v-tooltip.bottom="'Effacer'"
              class="text-gray-400 hover:text-gray-600"
            />
            
            <Button
              :icon="showAdvancedFilters ? 'pi pi-filter-slash' : 'pi pi-filter'"
              :severity="hasActiveFilters ? 'primary' : 'secondary'"
              text
              rounded
              @click="toggleAdvancedFilters"
              v-tooltip.bottom="'Filtres avancés'"
              :badge="hasActiveFilters ? String(Object.keys(filters).length) : undefined"
            />
  
            <Button
              label="Rechercher"
              icon="pi pi-search"
              :loading="isSearching"
              @click="performSearch"
              class="px-6"
            />
          </div>
        </div>
  
        <!-- Advanced Filters Panel -->
        <Transition name="slide-down">
          <div v-if="showAdvancedFilters" class="border-t border-gray-200 p-4 bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Brand Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="pi pi-tag mr-1"></i>
                  Marques
                </label>
                <MultiSelect
                  v-model="filters.brands"
                  :options="availableBrands"
                  placeholder="Toutes les marques"
                  :maxSelectedLabels="2"
                  class="w-full"
                  @change="onFilterChange"
                />
              </div>
  
              <!-- Tools Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="pi pi-wrench mr-1"></i>
                  Outils
                </label>
                <MultiSelect
                  v-model="filters.tools"
                  :options="availableTools"
                  placeholder="Tous les outils"
                  :maxSelectedLabels="2"
                  class="w-full"
                  @change="onFilterChange"
                />
              </div>
  
              <!-- Date Range -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="pi pi-calendar mr-1"></i>
                  Période
                </label>
                <Select
                  v-model="filters.dateRange"
                  :options="dateRangeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Toutes les dates"
                  class="w-full"
                  @change="onFilterChange"
                />
              </div>
  
              <!-- Sort By -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="pi pi-sort-alt mr-1"></i>
                  Trier par
                </label>
                <Select
                  v-model="filters.sortBy"
                  :options="sortOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Pertinence"
                  class="w-full"
                  @change="onFilterChange"
                />
              </div>
            </div>
  
            <!-- Filter Actions -->
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                <span v-if="hasActiveFilters">
                  {{ Object.keys(filters).filter(k => {
                    const key = k as keyof SearchFilters
                    const value = filters[key]
                    return value && (Array.isArray(value) ? value.length > 0 : true)
                  }).length }} filtre(s) actif(s)
                </span>
                <span v-else class="text-gray-400">Aucun filtre appliqué</span>
              </div>
              <div class="flex gap-2">
                <Button
                  label="Réinitialiser"
                  icon="pi pi-refresh"
                  text
                  size="small"
                  @click="resetFilters"
                  :disabled="!hasActiveFilters"
                />
                <Button
                  label="Appliquer"
                  icon="pi pi-check"
                  size="small"
                  @click="applyFilters"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
  
      <!-- Suggestions Dropdown -->
      <Transition name="fade">
        <div
          v-if="isExpanded && (suggestions.length > 0 || recentSearches.length > 0 || isSearching)"
          class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] overflow-hidden"
        >
          <!-- Loading State -->
          <div v-if="isSearching" class="p-8 text-center">
            <i class="pi pi-spin pi-spinner text-3xl text-primary-500 mb-2"></i>
            <p class="text-gray-600">Recherche en cours...</p>
          </div>
  
          <!-- Suggestions -->
          <div v-else class="overflow-y-auto max-h-[500px]">
            <!-- Quick Actions -->
            <div v-if="searchQuery && !suggestions.length" class="p-4 border-b border-gray-100">
              <div class="text-xs font-semibold text-gray-500 uppercase mb-2">Actions rapides</div>
              <button
                class="w-full flex items-center gap-3 p-3 hover:bg-primary-50 rounded-lg transition-colors text-left"
                @mousedown.prevent="createNewDoc"
              >
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-plus text-primary-600"></i>
                </div>
                <div>
                  <div class="font-medium text-gray-900">Créer une documentation</div>
                  <div class="text-sm text-gray-500">Pour "{{ searchQuery }}"</div>
                </div>
              </button>
            </div>
  
            <!-- Recent Searches -->
            <div v-if="!searchQuery && recentSearches.length > 0" class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs font-semibold text-gray-500 uppercase">Recherches récentes</div>
                <button
                  @mousedown.prevent="clearRecentSearches"
                  class="text-xs text-gray-400 hover:text-gray-600"
                >
                  Effacer
                </button>
              </div>
              <div class="space-y-1">
                <button
                  v-for="(search, index) in recentSearches"
                  :key="index"
                  class="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  @mousedown.prevent="applyRecentSearch(search)"
                >
                  <i class="pi pi-history text-gray-400"></i>
                  <span class="text-gray-700">{{ search }}</span>
                </button>
              </div>
            </div>
  
            <!-- Documentation Suggestions -->
            <div v-if="suggestions.length > 0" class="p-4">
              <div class="text-xs font-semibold text-gray-500 uppercase mb-3">
                Documentations ({{ suggestions.length }})
              </div>
              <div class="space-y-2">
                <button
                  v-for="(suggestion, index) in suggestions"
                  :key="suggestion.id"
                  :class="[
                    'w-full flex items-start gap-4 p-3 rounded-lg transition-all text-left',
                    selectedSuggestionIndex === index
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  ]"
                  @mousedown.prevent="selectSuggestion(suggestion)"
                  @mouseenter="selectedSuggestionIndex = index"
                >
                  <!-- Icon/Thumbnail -->
                  <div class="w-12 h-12 bg-linear-to-br from-primary-100 to-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                    <i class="pi pi-file text-xl text-primary-600"></i>
                  </div>
  
                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <h4 class="font-semibold text-gray-900 truncate" v-html="highlightMatch(suggestion.title)"></h4>
                      <Badge v-if="suggestion.score" :value="`${suggestion.score}%`" severity="success" size="small" />
                    </div>
                    
                    <p v-if="suggestion.content" class="text-sm text-gray-600 line-clamp-2 mb-2" v-html="highlightMatch(suggestion.content)"></p>
                    
                    <!-- Metadata -->
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                      <span v-if="suggestion.brands?.length" class="flex items-center gap-1">
                        <i class="pi pi-tag"></i>
                        {{ suggestion.brands.join(', ') }}
                      </span>
                      <span v-if="suggestion.tools?.length" class="flex items-center gap-1">
                        <i class="pi pi-wrench"></i>
                        {{ suggestion.tools.length }} outil(s)
                      </span>
                      <span class="flex items-center gap-1">
                        <i class="pi pi-clock"></i>
                        {{ formatDate(suggestion.updatedAt) }}
                      </span>
                    </div>
  
                    <!-- Match Info -->
                    <div v-if="suggestion.matchType" class="mt-2">
                      <Chip
                        :label="getMatchTypeLabel(suggestion.matchType)"
                        size="small"
                        class="bg-blue-50 text-blue-700"
                      />
                    </div>
                  </div>
  
                  <!-- Quick Actions -->
                  <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      icon="pi pi-eye"
                      text
                      rounded
                      size="small"
                      @mousedown.prevent.stop="viewDoc(suggestion)"
                      v-tooltip.left="'Voir'"
                    />
                    <Button
                      icon="pi pi-pencil"
                      text
                      rounded
                      size="small"
                      @mousedown.prevent.stop="editDoc(suggestion)"
                      v-tooltip.left="'Éditer'"
                    />
                  </div>
                </button>
              </div>
            </div>
  
            <!-- No Results -->
            <div v-if="searchQuery && !isSearching && suggestions.length === 0" class="p-8 text-center">
              <i class="pi pi-search text-4xl text-gray-300 mb-3"></i>
              <p class="text-gray-600 font-medium mb-2">Aucun résultat trouvé</p>
              <p class="text-sm text-gray-500 mb-4">Essayez avec d'autres mots-clés ou filtres</p>
              <Button
                label="Créer une nouvelle documentation"
                icon="pi pi-plus"
                @mousedown.prevent="createNewDoc"
                text
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useDebounceFn, onClickOutside } from '@vueuse/core'
  
  // Types
  interface Suggestion {
    id: string
    title: string
    content?: string
    brands?: string[]
    tools?: string[]
    updatedAt?: string
    score?: number
    matchType?: 'title' | 'content' | 'brand' | 'tool'
  }
  
  interface SearchFilters {
    brands: string[]
    tools: string[]
    dateRange: string | null
    sortBy: string | null
  }
  
  // Props & Emits
  const emit = defineEmits<{
    search: [query: string, filters: SearchFilters]
    select: [suggestion: Suggestion]
    filter: [filters: SearchFilters]
  }>()
  
  // Refs
  const searchBarRef = ref<HTMLElement>()
  const searchInput = ref<HTMLInputElement>()
  const searchQuery = ref('')
  const isFocused = ref(false)
  const isExpanded = ref(false)
  const isSearching = ref(false)
  const selectedSuggestionIndex = ref(-1)
  const showAdvancedFilters = ref(false)
  
  // Suggestions & Recent
  const suggestions = ref<Suggestion[]>([])
  const recentSearches = ref<string[]>([])
  
  // Filters
  const filters = ref<SearchFilters>({
    brands: [],
    tools: [],
    dateRange: null,
    sortBy: null
  })
  
  // Données dynamiques pour les filtres
  const availableBrands = ref<string[]>([])
  const availableTools = ref<string[]>([])
  
  const dateRangeOptions = [
    { label: 'Aujourd\'hui', value: 'today' },
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Cette année', value: 'year' },
    { label: 'Toutes les dates', value: null }
  ]
  
  const sortOptions = [
    { label: 'Pertinence', value: 'relevance' },
    { label: 'Plus récent', value: 'newest' },
    { label: 'Plus ancien', value: 'oldest' },
    { label: 'Titre (A-Z)', value: 'title-asc' },
    { label: 'Titre (Z-A)', value: 'title-desc' }
  ]
  
  // Computed
  const hasActiveFilters = computed(() => {
    return filters.value.brands.length > 0 ||
           filters.value.tools.length > 0 ||
           filters.value.dateRange ||
           filters.value.sortBy
  })
  
  const activeFilters = computed(() => {
    const active = []
    if (filters.value.brands.length > 0) {
      active.push({ key: 'brands', label: 'Marques', value: filters.value.brands.join(', ') })
    }
    if (filters.value.tools.length > 0) {
      active.push({ key: 'tools', label: 'Outils', value: filters.value.tools.join(', ') })
    }
    if (filters.value.dateRange) {
      const option = dateRangeOptions.find(o => o.value === filters.value.dateRange)
      active.push({ key: 'dateRange', label: 'Période', value: option?.label || '' })
    }
    return active
  })
  
  // Methods
  const handleFocus = () => {
    isFocused.value = true
    isExpanded.value = true
    loadRecentSearches()
  }
  
  const handleBlur = () => {
    setTimeout(() => {
      isFocused.value = false
    }, 200)
  }
  
  const handleInput = useDebounceFn(() => {
    if (searchQuery.value.length > 0) {
      fetchSuggestions()
    } else {
      suggestions.value = []
      isExpanded.value = recentSearches.value.length > 0
    }
  }, 300)
  
  const fetchSuggestions = async () => {
    isSearching.value = true
    
    try {
      // Appel à l'API de recherche réelle
      const params = new URLSearchParams({
        q: searchQuery.value,
        limit: '10'
      })

      const response = await $fetch<{ 
        success: boolean
        data: Array<{
          id: string
          title?: string
          content?: string | null
          tools: Array<{ name: string }>
          brands?: string[]
          updatedAt?: string
          createdAt?: string
        }>
      }>(`/api/documentation/search?${params.toString()}`)
      
      if (response.success && response.data) {
        suggestions.value = response.data.map((doc, index) => {
          // Déterminer le type de correspondance
          let matchType: 'title' | 'content' | 'brand' | 'tool' = 'content'
          let score = 100 - (index * 5) // Score décroissant basé sur l'ordre
          
          const query = searchQuery.value.toLowerCase()
          if (doc.title?.toLowerCase().includes(query)) {
            matchType = 'title'
            score = Math.min(100, score + 10)
          } else if (doc.brands?.some(b => b.toLowerCase().includes(query))) {
            matchType = 'brand'
          } else if (doc.tools.some(t => t.name.toLowerCase().includes(query))) {
            matchType = 'tool'
          }
          
          return {
            id: doc.id,
            title: doc.title || 'Sans titre',
            content: doc.content || undefined,
            brands: doc.brands || [],
            tools: doc.tools.map(t => t.name),
            updatedAt: doc.updatedAt || doc.createdAt,
            score,
            matchType
          }
        })
      } else {
        suggestions.value = []
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      suggestions.value = []
    } finally {
      isSearching.value = false
      isExpanded.value = true
    }
  }
  
  const performSearch = () => {
    if (searchQuery.value) {
      addToRecentSearches(searchQuery.value)
    }
    emit('search', searchQuery.value, filters.value)
    closeSuggestions()
  }
  
  const selectSuggestion = (suggestion: Suggestion) => {
    emit('select', suggestion)
    closeSuggestions()
  }
  
  const selectCurrentSuggestion = () => {
    if (selectedSuggestionIndex.value >= 0 && suggestions.value[selectedSuggestionIndex.value]) {
      const suggestion = suggestions.value[selectedSuggestionIndex.value]
      if (suggestion) {
        selectSuggestion(suggestion)
      }
    } else {
      performSearch()
    }
  }
  
  const navigateSuggestions = (direction: 'up' | 'down') => {
    if (!isExpanded.value) return
    
    const maxIndex = suggestions.value.length - 1
    
    if (direction === 'down') {
      selectedSuggestionIndex.value = selectedSuggestionIndex.value < maxIndex 
        ? selectedSuggestionIndex.value + 1 
        : 0
    } else {
      selectedSuggestionIndex.value = selectedSuggestionIndex.value > 0 
        ? selectedSuggestionIndex.value - 1 
        : maxIndex
    }
  }
  
  const closeSuggestions = () => {
    isExpanded.value = false
    selectedSuggestionIndex.value = -1
  }
  
  const clearSearch = () => {
    searchQuery.value = ''
    suggestions.value = []
    selectedSuggestionIndex.value = -1
    searchInput.value?.focus()
  }
  
  const toggleAdvancedFilters = () => {
    showAdvancedFilters.value = !showAdvancedFilters.value
  }
  
  const onFilterChange = () => {
    // Auto-apply on change
    if (searchQuery.value) {
      performSearch()
    }
  }
  
  const applyFilters = () => {
    emit('filter', filters.value)
    if (searchQuery.value) {
      performSearch()
    }
    showAdvancedFilters.value = false
  }
  
  const resetFilters = () => {
    filters.value = {
      brands: [],
      tools: [],
      dateRange: null,
      sortBy: null
    }
    onFilterChange()
  }
  
  const removeFilter = (key: string) => {
    if (key === 'brands' || key === 'tools') {
      filters.value[key as 'brands' | 'tools'] = []
    } else if (key === 'dateRange' || key === 'sortBy') {
      filters.value[key as 'dateRange' | 'sortBy'] = null
    }
    onFilterChange()
  }
  
  // Recent Searches
  const loadRecentSearches = () => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  }
  
  const addToRecentSearches = (query: string) => {
    recentSearches.value = [
      query,
      ...recentSearches.value.filter(s => s !== query)
    ].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
  }
  
  const clearRecentSearches = () => {
    recentSearches.value = []
    localStorage.removeItem('recentSearches')
  }
  
  const applyRecentSearch = (search: string) => {
    searchQuery.value = search
    performSearch()
  }
  
  // Quick Actions
  const createNewDoc = () => {
    navigateTo('/documentation?title=' + encodeURIComponent(searchQuery.value))
  }
  
  const viewDoc = (doc: Suggestion) => {
    navigateTo(`/documentation/${doc.id}/view`)
  }
  
  const editDoc = (doc: Suggestion) => {
    navigateTo(`/documentation/${doc.id}`)
  }
  
  // Utilities
  const highlightMatch = (text: string) => {
    if (!searchQuery.value || !text) return text
    const regex = new RegExp(`(${searchQuery.value})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900 px-1 rounded">$1</mark>')
  }
  
  const getMatchTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      title: 'Correspondance dans le titre',
      content: 'Correspondance dans le contenu',
      brand: 'Correspondance dans les marques',
      tool: 'Correspondance dans les outils'
    }
    return labels[type] || 'Correspondance'
  }
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Aujourd'hui"
    if (diffInDays === 1) return 'Hier'
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
  
  // Click outside
  onClickOutside(searchBarRef, () => {
    closeSuggestions()
    showAdvancedFilters.value = false
  })
  
  // Load available brands and tools
  const loadAvailableFilters = async () => {
    try {
      // Charger toutes les documentations pour extraire les marques et outils
      const response = await $fetch<{ 
        success: boolean
        data: Array<{
          brands?: string[]
          tools: Array<{ name: string }>
        }>
      }>('/api/documentation?limit=1000')
      
      if (response.success && response.data) {
        const docs = Array.isArray(response.data) ? response.data : [response.data]
        
        // Extraire les marques uniques
        const brandsSet = new Set<string>()
        docs.forEach(doc => {
          if (doc.brands) {
            doc.brands.forEach(brand => brandsSet.add(brand))
          }
        })
        availableBrands.value = Array.from(brandsSet).sort()
        
        // Extraire les outils uniques
        const toolsSet = new Set<string>()
        docs.forEach(doc => {
          if (doc.tools) {
            doc.tools.forEach(tool => toolsSet.add(tool.name))
          }
        })
        availableTools.value = Array.from(toolsSet).sort()
      }
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }

  // Lifecycle
  onMounted(() => {
    loadRecentSearches()
    loadAvailableFilters()
  })
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Animations */
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
  }
  
  .slide-down-enter-from {
    opacity: 0;
    transform: scaleY(0.95);
  }
  
  .slide-down-leave-to {
    opacity: 0;
    transform: scaleY(0.95);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  mark {
    font-weight: 600;
  }
  </style>
  