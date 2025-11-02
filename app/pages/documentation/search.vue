<template>
    <div class="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
        <!-- Header -->
        <header class="bg-white shadow-md border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <Button 
                            icon="pi pi-arrow-left" 
                            text 
                            rounded 
                            @click="navigateTo('/documentation/list')"
                            v-tooltip.bottom="'Retour à la liste'"
                        />
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Recherche de Documentation</h1>
                            <p class="text-sm text-gray-500 mt-1">Trouvez rapidement vos documentations techniques</p>
                        </div>
                    </div>
                    <Button 
                        label="Nouvelle Documentation" 
                        icon="pi pi-plus" 
                        severity="success"
                        @click="navigateTo('/documentation')"
                    />
                </div>
            </div>
        </header>

        <!-- Search Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SearchBar 
                @search="handleSearch"
                @select="handleSelectSuggestion"
                @filter="handleFilter"
            />
        </div>

        <!-- Results Section -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <!-- Loading State -->
            <div v-if="isSearching" class="flex flex-col items-center justify-center py-20">
                <i class="pi pi-spin pi-spinner text-5xl text-primary-500 mb-4"></i>
                <p class="text-xl text-gray-600 font-medium">Recherche en cours...</p>
                <p class="text-sm text-gray-500 mt-2">Analyse des documentations</p>
            </div>

            <!-- Results Header -->
            <div v-else-if="searchResults !== null" class="mb-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">
                            Résultats de recherche
                            <Badge 
                                v-if="searchResults.length > 0" 
                                :value="searchResults.length" 
                                severity="info" 
                                class="ml-3"
                            />
                        </h2>
                        <p class="text-sm text-gray-500 mt-1" v-if="currentQuery">
                            Recherche pour : <span class="font-semibold text-gray-700">"{{ currentQuery }}"</span>
                        </p>
                    </div>
                    <Button 
                        label="Effacer les résultats" 
                        icon="pi pi-times"
                        text
                        @click="clearResults"
                    />
                </div>

                <!-- No Results -->
                <div v-if="searchResults.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div class="max-w-md mx-auto">
                        <i class="pi pi-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                        <p class="text-gray-500 mb-6">
                            Nous n'avons pas trouvé de documentation correspondant à votre recherche "{{ currentQuery }}".
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button 
                                label="Créer une documentation" 
                                icon="pi pi-plus"
                                @click="navigateTo('/documentation')"
                            />
                            <Button 
                                label="Voir toutes les docs" 
                                icon="pi pi-list"
                                severity="secondary"
                                outlined
                                @click="navigateTo('/documentation/list')"
                            />
                        </div>
                    </div>
                </div>

                <!-- Results Grid -->
                <div v-else class="space-y-4">
                    <!-- View Options -->
                    <div class="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600">Affichage :</span>
                            <SelectButton 
                                v-model="viewMode" 
                                :options="viewModeOptions" 
                                optionLabel="label" 
                                optionValue="value"
                            >
                                <template #option="slotProps">
                                    <i :class="slotProps.option.icon"></i>
                                </template>
                            </SelectButton>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600">Trier par :</span>
                            <Select 
                                v-model="sortBy" 
                                :options="sortOptions" 
                                optionLabel="label" 
                                optionValue="value"
                                @change="sortResults"
                                class="w-48"
                            />
                        </div>
                    </div>

                    <!-- Grid View -->
                    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DocumentationCard 
                            v-for="doc in sortedResults" 
                            :key="doc.id"
                            :documentation="doc"
                            @click="navigateTo(`/documentation/${doc.id}`)"
                            @delete="confirmDelete(doc)"
                        />
                    </div>

                    <!-- List View -->
                    <div v-else class="space-y-3">
                        <DocumentationListItem 
                            v-for="doc in sortedResults" 
                            :key="doc.id"
                            :documentation="doc"
                            :search-query="currentQuery"
                            @click="navigateTo(`/documentation/${doc.id}`)"
                            @delete="confirmDelete(doc)"
                        />
                    </div>
                </div>
            </div>

            <!-- Initial State -->
            <div v-else class="text-center py-20">
                <div class="max-w-2xl mx-auto">
                    <i class="pi pi-search text-7xl text-gray-300 mb-6"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-3">
                        Commencez votre recherche
                    </h2>
                    <p class="text-gray-600 mb-8">
                        Utilisez la barre de recherche ci-dessus pour trouver vos documentations techniques.
                        Vous pouvez rechercher par titre, contenu, marque ou outil.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="bg-white rounded-lg p-6 shadow-sm">
                            <i class="pi pi-bolt text-3xl text-blue-500 mb-3"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Recherche rapide</h3>
                            <p class="text-sm text-gray-600">Suggestions en temps réel pendant que vous tapez</p>
                        </div>
                        <div class="bg-white rounded-lg p-6 shadow-sm">
                            <i class="pi pi-filter text-3xl text-purple-500 mb-3"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Filtres avancés</h3>
                            <p class="text-sm text-gray-600">Filtrez par marque, outil, date et plus</p>
                        </div>
                        <div class="bg-white rounded-lg p-6 shadow-sm">
                            <i class="pi pi-history text-3xl text-green-500 mb-3"></i>
                            <h3 class="font-semibold text-gray-900 mb-2">Historique</h3>
                            <p class="text-sm text-gray-600">Accédez à vos recherches récentes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog 
            v-model:visible="showDeleteDialog" 
            modal 
            header="Confirmer la suppression"
            :style="{ width: '450px' }"
        >
            <div class="flex items-start gap-3">
                <i class="pi pi-exclamation-triangle text-3xl text-orange-500"></i>
                <div>
                    <p class="mb-2">Êtes-vous sûr de vouloir supprimer cette documentation ?</p>
                    <p class="text-sm text-gray-600 font-semibold">{{ docToDelete?.title || 'Sans titre' }}</p>
                    <p class="text-sm text-red-600 mt-2">Cette action est irréversible.</p>
                </div>
            </div>
            <template #footer>
                <Button 
                    label="Annuler" 
                    text 
                    @click="showDeleteDialog = false"
                />
                <Button 
                    label="Supprimer" 
                    severity="danger"
                    @click="handleDelete"
                    :loading="isDeleting"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocumentationLoader, type DocumentationData } from '~/composables/useDocumentationLoader';
import { useToast } from 'primevue/usetoast';
import SearchBar from '~/components/SearchBar.vue';

const toast = useToast();
const { searchDocumentations, deleteDocumentation } = useDocumentationLoader();

// Search state
const searchResults = ref<DocumentationData[] | null>(null);
const currentQuery = ref('');
const currentFilters = ref<any>({});
const isSearching = ref(false);

// View options
const viewMode = ref('grid');
const viewModeOptions = [
    { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' },
    { label: 'Liste', value: 'list', icon: 'pi pi-list' }
];

// Sort options
const sortBy = ref('relevance');
const sortOptions = [
    { label: 'Pertinence', value: 'relevance' },
    { label: 'Plus récent', value: 'newest' },
    { label: 'Plus ancien', value: 'oldest' },
    { label: 'Titre (A-Z)', value: 'title-asc' },
    { label: 'Titre (Z-A)', value: 'title-desc' }
];

// Delete state
const showDeleteDialog = ref(false);
const docToDelete = ref<DocumentationData | null>(null);
const isDeleting = ref(false);

// Computed
const sortedResults = computed(() => {
    if (!searchResults.value) return [];
    
    const results = [...searchResults.value];
    
    switch (sortBy.value) {
        case 'newest':
            return results.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0);
                const dateB = new Date(b.updatedAt || b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
            });
        case 'oldest':
            return results.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0);
                const dateB = new Date(b.updatedAt || b.createdAt || 0);
                return dateA.getTime() - dateB.getTime();
            });
        case 'title-asc':
            return results.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        case 'title-desc':
            return results.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        default:
            return results;
    }
});

// Methods
const handleSearch = async (query: string, filters: any) => {
    if (!query.trim()) {
        clearResults();
        return;
    }

    isSearching.value = true;
    currentQuery.value = query;
    currentFilters.value = filters;

    try {
        const results = await searchDocumentations(query);
        searchResults.value = results || [];
        
        // Apply filters if any
        if (filters && searchResults.value) {
            searchResults.value = applyFilters(searchResults.value, filters);
        }

        toast.add({
            severity: 'success',
            summary: 'Recherche terminée',
            detail: `${searchResults.value.length} résultat(s) trouvé(s)`,
            life: 3000
        });
    } catch (error) {
        console.error('Search error:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la recherche',
            life: 3000
        });
        searchResults.value = [];
    } finally {
        isSearching.value = false;
    }
};

const handleSelectSuggestion = (suggestion: any) => {
    navigateTo(`/documentation/${suggestion.id}`);
};

const handleFilter = (filters: any) => {
    currentFilters.value = filters;
    if (searchResults.value) {
        searchResults.value = applyFilters(searchResults.value, filters);
    }
};

const applyFilters = (results: DocumentationData[], filters: any): DocumentationData[] => {
    let filtered = [...results];

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
        filtered = filtered.filter(doc => {
            // Assuming brands are stored in the documentation
            const docBrands = (doc as any).brands || [];
            return filters.brands.some((brand: string) => docBrands.includes(brand));
        });
    }

    // Filter by tools
    if (filters.tools && filters.tools.length > 0) {
        filtered = filtered.filter(doc => {
            const toolNames = doc.tools.map(t => t.name);
            return filters.tools.some((tool: string) => toolNames.includes(tool));
        });
    }

    // Filter by date range
    if (filters.dateRange) {
        const now = new Date();
        filtered = filtered.filter(doc => {
            const docDate = new Date(doc.updatedAt || doc.createdAt || 0);
            const diffInDays = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
            
            switch (filters.dateRange) {
                case 'today':
                    return diffInDays === 0;
                case 'week':
                    return diffInDays <= 7;
                case 'month':
                    return diffInDays <= 30;
                case 'year':
                    return diffInDays <= 365;
                default:
                    return true;
            }
        });
    }

    return filtered;
};

const sortResults = () => {
    // Trigger reactivity
    searchResults.value = searchResults.value ? [...searchResults.value] : null;
};

const clearResults = () => {
    searchResults.value = null;
    currentQuery.value = '';
    currentFilters.value = {};
};

// Delete methods
const confirmDelete = (doc: DocumentationData) => {
    docToDelete.value = doc;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    if (!docToDelete.value) return;

    isDeleting.value = true;
    const success = await deleteDocumentation(docToDelete.value.id);

    if (success) {
        toast.add({
            severity: 'success',
            summary: 'Supprimé',
            detail: 'Documentation supprimée avec succès',
            life: 3000
        });

        // Remove from results
        if (searchResults.value) {
            searchResults.value = searchResults.value.filter(d => d.id !== docToDelete.value?.id);
        }
    } else {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la documentation',
            life: 3000
        });
    }

    isDeleting.value = false;
    showDeleteDialog.value = false;
    docToDelete.value = null;
};
</script>

<style scoped>
/* Additional styles if needed */
</style>

