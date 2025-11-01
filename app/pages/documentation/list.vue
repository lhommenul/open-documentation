<template>
    <div class="min-h-screen bg-gray-50">
        <!-- HEADER -->
        <header class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <i class="pi pi-book text-3xl text-blue-600"></i>
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">Mes Documentations</h1>
                            <p class="text-sm text-gray-500 mt-1">Gérez vos documentations techniques</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <Button 
                            label="Nouvelle Documentation" 
                            icon="pi pi-plus" 
                            severity="success"
                            @click="navigateTo('/documentation')"
                        />
                    </div>
                </div>
            </div>
        </header>

        <!-- SEARCH BAR -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="bg-white rounded-lg shadow-sm p-4">
                <div class="flex gap-3">
                    <IconField iconPosition="left" class="flex-1">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText 
                            v-model="searchQuery"
                            placeholder="Rechercher une documentation..."
                            class="w-full"
                            @keydown.enter="handleSearch"
                        />
                    </IconField>
                    <Button 
                        label="Rechercher" 
                        icon="pi pi-search"
                        @click="handleSearch"
                        :loading="isSearching"
                    />
                    <Button 
                        v-if="searchQuery"
                        label="Réinitialiser" 
                        icon="pi pi-times"
                        severity="secondary"
                        text
                        @click="resetSearch"
                    />
                </div>
            </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="isLoading && !searchResults" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="text-center">
                <i class="pi pi-spin pi-spinner text-5xl text-blue-500 mb-4"></i>
                <p class="text-xl text-gray-600">Chargement des documentations...</p>
            </div>
        </div>

        <!-- SEARCH RESULTS -->
        <div v-else-if="searchResults" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">
                    Résultats de recherche
                    <Badge :value="searchResults.length" severity="info" class="ml-2" />
                </h2>
            </div>

            <div v-if="searchResults.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <i class="pi pi-search text-5xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-500">Aucun résultat pour "{{ searchQuery }}"</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="doc in searchResults" 
                    :key="doc.id"
                    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    @click="navigateTo(`/documentation/${doc.id}`)"
                >
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                                {{ doc.title || 'Sans titre' }}
                            </h3>
                        </div>
                        
                        <p v-if="doc.content" class="text-sm text-gray-600 line-clamp-3 mb-4">
                            {{ doc.content }}
                        </p>

                        <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span class="flex items-center gap-1">
                                <i class="pi pi-list"></i>
                                {{ doc.children?.length || 0 }} étape(s)
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="pi pi-hammer"></i>
                                {{ doc.tools?.length || 0 }} outil(s)
                            </span>
                        </div>

                        <div class="flex items-center justify-between pt-3 border-t">
                            <span class="text-xs text-gray-500">
                                {{ formatDate(doc.updatedAt || doc.createdAt) }}
                            </span>
                            <div class="flex gap-2">
                                <Button 
                                    icon="pi pi-pencil" 
                                    text
                                    rounded
                                    size="small"
                                    severity="secondary"
                                    @click.stop="navigateTo(`/documentation/${doc.id}`)"
                                    v-tooltip.top="'Éditer'"
                                />
                                <Button 
                                    icon="pi pi-trash" 
                                    text
                                    rounded
                                    size="small"
                                    severity="danger"
                                    @click.stop="confirmDelete(doc)"
                                    v-tooltip.top="'Supprimer'"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- DOCUMENTATION LIST -->
        <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">
                    Toutes les documentations
                    <Badge v-if="pagination" :value="pagination.total" severity="info" class="ml-2" />
                </h2>
                
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">Trier par:</label>
                    <Select 
                        v-model="sortBy" 
                        :options="sortOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        @change="loadDocs"
                    />
                    <Button 
                        :icon="sortOrder === 'desc' ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up'"
                        text
                        rounded
                        @click="toggleSortOrder"
                        v-tooltip.top="sortOrder === 'desc' ? 'Plus récents d\'abord' : 'Plus anciens d\'abord'"
                    />
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="documentations.length === 0 && !isLoading" class="bg-white rounded-lg shadow-sm p-12 text-center">
                <i class="pi pi-file text-6xl text-gray-300 mb-4"></i>
                <p class="text-xl text-gray-500 mb-4">Aucune documentation pour le moment</p>
                <Button 
                    label="Créer votre première documentation" 
                    icon="pi pi-plus"
                    size="large"
                    @click="navigateTo('/documentation')"
                />
            </div>

            <!-- Documentation Cards -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    v-for="doc in documentations" 
                    :key="doc.id"
                    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
                    @click="navigateTo(`/documentation/${doc.id}`)"
                >
                    <div class="p-6">
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {{ doc.title || 'Sans titre' }}
                            </h3>
                        </div>
                        
                        <p v-if="doc.content" class="text-sm text-gray-600 line-clamp-3 mb-4">
                            {{ doc.content }}
                        </p>

                        <div class="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span class="flex items-center gap-1">
                                <i class="pi pi-list"></i>
                                {{ doc.children?.length || 0 }} étape(s)
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="pi pi-hammer"></i>
                                {{ doc.tools?.length || 0 }} outil(s)
                            </span>
                        </div>

                        <div class="flex items-center justify-between pt-3 border-t">
                            <span class="text-xs text-gray-500">
                                {{ formatDate(doc.updatedAt || doc.createdAt) }}
                            </span>
                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    icon="pi pi-pencil" 
                                    text
                                    rounded
                                    size="small"
                                    severity="secondary"
                                    @click.stop="navigateTo(`/documentation/${doc.id}`)"
                                    v-tooltip.top="'Éditer'"
                                />
                                <Button 
                                    icon="pi pi-trash" 
                                    text
                                    rounded
                                    size="small"
                                    severity="danger"
                                    @click.stop="confirmDelete(doc)"
                                    v-tooltip.top="'Supprimer'"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination && pagination.total > pagination.limit" class="mt-8 flex items-center justify-center gap-2">
                <Button 
                    icon="pi pi-chevron-left"
                    text
                    rounded
                    :disabled="pagination.skip === 0"
                    @click="previousPage"
                />
                <span class="text-sm text-gray-600">
                    Page {{ Math.floor(pagination.skip / pagination.limit) + 1 }} sur {{ Math.ceil(pagination.total / pagination.limit) }}
                </span>
                <Button 
                    icon="pi pi-chevron-right"
                    text
                    rounded
                    :disabled="!pagination.hasMore"
                    @click="nextPage"
                />
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
import { useDocumentationLoader, type DocumentationData } from '~/composables/useDocumentationLoader';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const { isLoading, loadDocumentations, searchDocumentations, deleteDocumentation } = useDocumentationLoader();

// État
const documentations = ref<DocumentationData[]>([]);
const searchResults = ref<DocumentationData[] | null>(null);
const searchQuery = ref('');
const isSearching = ref(false);
const pagination = ref<any>(null);
const currentPage = ref(0);
const pageSize = ref(12);

// Tri
const sortBy = ref('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');
const sortOptions = [
    { label: 'Date de création', value: 'createdAt' },
    { label: 'Date de modification', value: 'updatedAt' },
    { label: 'Titre', value: 'title' }
];

// Suppression
const showDeleteDialog = ref(false);
const docToDelete = ref<DocumentationData | null>(null);
const isDeleting = ref(false);

// Charger les documentations
const loadDocs = async () => {
    const result = await loadDocumentations({
        limit: pageSize.value,
        skip: currentPage.value * pageSize.value,
        sortBy: sortBy.value,
        order: sortOrder.value
    });

    if (result) {
        documentations.value = result.data;
        pagination.value = result.pagination;
    }
};

// Recherche
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        resetSearch();
        return;
    }

    isSearching.value = true;
    const results = await searchDocumentations(searchQuery.value);
    searchResults.value = results || [];
    isSearching.value = false;
};

const resetSearch = () => {
    searchQuery.value = '';
    searchResults.value = null;
    loadDocs();
};

// Pagination
const nextPage = () => {
    currentPage.value++;
    loadDocs();
};

const previousPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--;
        loadDocs();
    }
};

// Tri
const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
    loadDocs();
};

// Suppression
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

        // Rafraîchir la liste
        if (searchResults.value) {
            searchResults.value = searchResults.value.filter(d => d.id !== docToDelete.value?.id);
        } else {
            await loadDocs();
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

// Formatage de date
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        return "Aujourd'hui";
    } else if (diffInDays === 1) {
        return 'Hier';
    } else if (diffInDays < 7) {
        return `Il y a ${diffInDays} jours`;
    } else {
        return date.toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};

// Lifecycle
onMounted(() => {
    loadDocs();
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

