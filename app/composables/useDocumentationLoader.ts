import type { Ref } from 'vue';

export interface DocumentationData {
  id: string;
  content: string | null;
  order: number;
  title?: string;
  tools: Array<{ name: string }>;
  pictures: Array<{
    filename?: string;
    url?: string;
    rawFilename?: string;
  }>;
  children: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentationListResponse {
  success: boolean;
  data: DocumentationData | DocumentationData[];
  pagination?: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export const useDocumentationLoader = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Charge une documentation spécifique par son ID
   */
  const loadDocumentationById = async (id: string): Promise<DocumentationData | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<DocumentationListResponse>(`/api/documentation?id=${id}`);
      
      if (!response.success || !response.data) {
        throw new Error('Documentation non trouvée');
      }

      return response.data as DocumentationData;
    } catch (err: any) {
      console.error('Error loading documentation:', err);
      error.value = err.message || 'Erreur lors du chargement de la documentation';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Charge une liste de documentations avec pagination
   */
  const loadDocumentations = async (options: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<{ data: DocumentationData[]; pagination?: any } | null> => {
    isLoading.value = true;
    error.value = null;

    const { limit = 50, skip = 0, sortBy = 'createdAt', order = 'desc' } = options;

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
        sortBy,
        order
      });

      const response = await $fetch<DocumentationListResponse>(`/api/documentation?${params.toString()}`);
      
      if (!response.success) {
        throw new Error('Erreur lors du chargement des documentations');
      }

      return {
        data: Array.isArray(response.data) ? response.data : [response.data],
        pagination: response.pagination
      };
    } catch (err: any) {
      console.error('Error loading documentations:', err);
      error.value = err.message || 'Erreur lors du chargement des documentations';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Recherche dans les documentations
   */
  const searchDocumentations = async (query: string, limit = 20): Promise<DocumentationData[] | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      });

      const response = await $fetch<{ success: boolean; data: DocumentationData[] }>(`/api/documentation/search?${params.toString()}`);
      
      if (!response.success) {
        throw new Error('Erreur lors de la recherche');
      }

      return response.data;
    } catch (err: any) {
      console.error('Error searching documentations:', err);
      error.value = err.message || 'Erreur lors de la recherche';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Supprime une documentation par son ID
   */
  const deleteDocumentation = async (id: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/documentation/${id}`, {
        method: 'DELETE'
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting documentation:', err);
      error.value = err.message || 'Erreur lors de la suppression';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadDocumentationById,
    loadDocumentations,
    searchDocumentations,
    deleteDocumentation
  };
};

