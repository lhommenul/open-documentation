<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Header de la marque -->
      <div class="mb-8">
        <Button
          icon="pi pi-arrow-left"
          label="Retour"
          text
          @click="router.back()"
          class="mb-4"
        />
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ brandName }}</h1>
            <p class="text-gray-600">
              {{ totalDocumentations }} documentation(s) disponible(s)
            </p>
          </div>
          
          <Button
            v-if="canEdit"
            icon="pi pi-plus"
            label="Nouvelle documentation"
            @click="createNewDoc"
          />
        </div>
      </div>
  
      <!-- Barre de recherche et filtres -->
      <Card class="mb-6">
        <template #content>
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-2">Rechercher</label>
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Rechercher dans les documentations..."
                  class="w-full"
                  @input="debouncedSearch"
                />
              </IconField>
            </div>
            
            <div class="w-48">
              <label class="block text-sm font-medium mb-2">Trier par</label>
              <Dropdown
                v-model="sortBy"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                @change="loadDocumentations"
              />
            </div>
            
            <div class="w-32">
              <label class="block text-sm font-medium mb-2">Ordre</label>
              <SelectButton
                v-model="sortOrder"
                :options="orderOptions"
                optionLabel="label"
                optionValue="value"
                @change="loadDocumentations"
              />
            </div>
          </div>
        </template>
      </Card>
  
      <!-- Liste des documentations -->
      <div v-if="loading" class="flex justify-center py-12">
        <ProgressSpinner />
      </div>
  
      <div v-else-if="error" class="text-center py-12">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="text-red-600">{{ error }}</p>
        <Button label="Réessayer" @click="loadDocumentations" class="mt-4" />
      </div>
  
      <div v-else-if="documentations.length === 0" class="text-center py-12">
        <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600">Aucune documentation trouvée</p>
      </div>
  
      <div v-else class="grid grid-cols-1 gap-4">
        <DocumentationCard
          v-for="doc in documentations"
          :key="doc.id"
          :documentation="doc"
          @view="viewDocumentation"
          @edit="editDocumentation"
          @delete="confirmDelete"
        />
      </div>
  
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <Paginator
          v-model:first="first"
          :rows="limit"
          :totalRecords="totalDocumentations"
          @page="onPageChange"
        />
      </div>
  
      <!-- Dialog de confirmation de suppression -->
      <Dialog
        v-model:visible="deleteDialogVisible"
        header="Confirmer la suppression"
        :modal="true"
        class="w-[450px]"
      >
        <div class="flex items-center gap-4">
          <i class="pi pi-exclamation-triangle text-3xl text-orange-500"></i>
          <span>Êtes-vous sûr de vouloir supprimer cette documentation ?</span>
        </div>
        
        <template #footer>
          <Button
            label="Annuler"
            text
            @click="deleteDialogVisible = false"
          />
          <Button
            label="Supprimer"
            severity="danger"
            @click="deleteDocumentation"
            :loading="deleting"
          />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDebounceFn } from '@vueuse/core'
  import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation'
  
  const route = useRoute()
  const router = useRouter()
  
  // État
  const brandName = computed(() => route.params.brand as string)
  const documentations = ref<AbstractDocumentation[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalDocumentations = ref(0)
  const canEdit = ref(true) // À adapter selon vos permissions
  
  // Filtres et recherche
  const searchQuery = ref('')
  const sortBy = ref('createdAt')
  const sortOrder = ref('desc')
  const first = ref(0)
  const limit = ref(10)
  
  const sortOptions = [
    { label: 'Date de création', value: 'createdAt' },
    { label: 'Date de modification', value: 'updatedAt' },
    { label: 'Titre', value: 'title' },
    { label: 'Ordre', value: 'order' }
  ]
  
  const orderOptions = [
    { label: 'Desc', value: 'desc' },
    { label: 'Asc', value: 'asc' }
  ]
  
  const totalPages = computed(() => Math.ceil(totalDocumentations.value / limit.value))
  
  // Suppression
  const deleteDialogVisible = ref(false)
  const documentToDelete = ref<string | null>(null)
  const deleting = ref(false)
  
  // Chargement des documentations
  const loadDocumentations = async () => {
    loading.value = true
    error.value = null
  
    try {
      const { data } = await useFetch('/api/documentation', {
        query: {
          brand: brandName.value,
          search: searchQuery.value,
          sortBy: sortBy.value,
          order: sortOrder.value,
          limit: limit.value,
          skip: first.value
        }
      })
  
      if (data.value?.success) {
        documentations.value = data.value.data
        totalDocumentations.value = data.value.pagination.total
      } else {
        throw new Error('Failed to load documentations')
      }
    } catch (e) {
      error.value = 'Erreur lors du chargement des documentations'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  
  // Recherche avec debounce
  const debouncedSearch = useDebounceFn(() => {
    first.value = 0
    loadDocumentations()
  }, 500)
  
  // Actions
  const viewDocumentation = (doc: AbstractDocumentation) => {
    router.push(`/brands/${brandName.value}/documentation/${doc.getID()}`)
  }
  
  const editDocumentation = (doc: AbstractDocumentation) => {
    router.push(`/brands/${brandName.value}/documentation/${doc.getID()}/edit`)
  }
  
  const createNewDoc = () => {
    router.push(`/brands/${brandName.value}/documentation/new`)
  }
  
  const confirmDelete = (doc: AbstractDocumentation) => {
    documentToDelete.value = doc.getID()
    deleteDialogVisible.value = true
  }
  
  const deleteDocumentation = async () => {
    if (!documentToDelete.value) return
  
    deleting.value = true
  
    try {
      await $fetch(`/api/documentation/${documentToDelete.value}`, {
        method: 'DELETE'
      })
  
      deleteDialogVisible.value = false
      documentToDelete.value = null
      loadDocumentations()
    } catch (e) {
      console.error('Delete error:', e)
      error.value = 'Erreur lors de la suppression'
    } finally {
      deleting.value = false
    }
  }
  
  const onPageChange = (event: any) => {
    first.value = event.first
    loadDocumentations()
  }
  
  onMounted(() => {
    loadDocumentations()
  })
  </script>
  