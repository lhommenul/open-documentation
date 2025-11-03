<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <Card class="max-w-2xl mx-auto">
        <template #header>
          <div class="p-6 border-b">
            <h1 class="text-3xl font-bold text-gray-900">
              Configuration de l'application
            </h1>
            <p class="text-gray-600 mt-2">
              Gérez les paramètres globaux de l'application
            </p>
          </div>
        </template>
        
        <template #content>
          <div class="space-y-6">
            <!-- Mode Alpha -->
            <div class="border rounded-lg p-6 bg-white">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <i class="pi pi-lock text-2xl text-primary-600"></i>
                    <h2 class="text-xl font-semibold text-gray-900">
                      Mode Alpha
                    </h2>
                  </div>
                  <p class="text-gray-600 text-sm mb-4">
                    Lorsque activé, seule la page d'accueil est accessible. 
                    Toutes les autres pages redirigent automatiquement vers l'accueil.
                  </p>
                  
                  <div v-if="loading" class="flex items-center gap-2 text-gray-600">
                    <i class="pi pi-spin pi-spinner"></i>
                    <span>Chargement...</span>
                  </div>
                  
                  <div v-else class="space-y-3">
                    <div class="flex items-center gap-3">
                      <InputSwitch 
                        v-model="alphaModeLocal" 
                        :disabled="updating"
                        @change="handleToggle"
                      />
                      <span class="font-medium" :class="alphaModeLocal ? 'text-yellow-600' : 'text-green-600'">
                        {{ alphaModeLocal ? 'Activé' : 'Désactivé' }}
                      </span>
                    </div>
                    
                    <div v-if="alphaModeLocal" class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <i class="pi pi-exclamation-triangle text-yellow-600 mt-1"></i>
                      <div class="text-sm text-yellow-800">
                        <strong>Mode Alpha activé :</strong> Les utilisateurs ne peuvent accéder qu'à la page d'accueil.
                      </div>
                    </div>
                    
                    <div v-else class="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <i class="pi pi-check-circle text-green-600 mt-1"></i>
                      <div class="text-sm text-green-800">
                        <strong>Mode normal :</strong> Toutes les pages sont accessibles.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <Message v-if="error" severity="error" :closable="true" @close="error = null">
              Une erreur s'est produite : {{ error.message }}
            </Message>

            <!-- Message de succès -->
            <Message v-if="successMessage" severity="success" :closable="true" @close="successMessage = null">
              {{ successMessage }}
            </Message>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-between items-center p-6 border-t bg-gray-50">
            <Button 
              label="Retour à l'accueil" 
              icon="pi pi-arrow-left" 
              text
              @click="navigateTo('/')"
            />
            <div class="text-sm text-gray-500">
              Dernière modification : {{ lastUpdate }}
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { alphaMode, loading, error: fetchError, fetchAlphaMode, updateAlphaMode } = useAlphaMode();

const alphaModeLocal = ref<boolean>(true);
const updating = ref<boolean>(false);
const successMessage = ref<string | null>(null);
const error = ref<Error | null>(null);
const lastUpdate = ref<string>('Non disponible');

// Charger la configuration au montage
onMounted(async () => {
  await fetchAlphaMode();
  alphaModeLocal.value = alphaMode.value;
});

// Synchroniser avec le composable
watch(alphaMode, (newValue) => {
  alphaModeLocal.value = newValue;
});

// Gérer le changement de toggle
const handleToggle = async () => {
  updating.value = true;
  error.value = null;
  successMessage.value = null;
  
  try {
    const response = await updateAlphaMode(alphaModeLocal.value);
    successMessage.value = `Mode alpha ${alphaModeLocal.value ? 'activé' : 'désactivé'} avec succès`;
    lastUpdate.value = new Date().toLocaleString('fr-FR');
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (e) {
    error.value = e as Error;
    // Revenir à l'état précédent en cas d'erreur
    alphaModeLocal.value = !alphaModeLocal.value;
  } finally {
    updating.value = false;
  }
};
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>

