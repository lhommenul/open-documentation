export const useAlphaMode = () => {
  const alphaMode = useState<boolean>('alphaMode', () => true);
  const loading = useState<boolean>('alphaModeLoading', () => false);
  const error = useState<Error | null>('alphaModeError', () => null);

  const fetchAlphaMode = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch<{ alphaMode: boolean; updatedAt: Date }>('/api/config/app');
      alphaMode.value = response.alphaMode;
      return response.alphaMode;
    } catch (e) {
      error.value = e as Error;
      console.error('Error fetching alpha mode:', e);
      return alphaMode.value;
    } finally {
      loading.value = false;
    }
  };

  const updateAlphaMode = async (newValue: boolean) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch<{ alphaMode: boolean; updatedAt: Date; message: string }>('/api/config/app', {
        method: 'PUT',
        body: { alphaMode: newValue }
      });
      alphaMode.value = response.alphaMode;
      return response;
    } catch (e) {
      error.value = e as Error;
      console.error('Error updating alpha mode:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const isAlphaMode = computed(() => alphaMode.value);

  return {
    alphaMode: isAlphaMode,
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchAlphaMode,
    updateAlphaMode
  };
};

