<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div v-if="pending" class="space-y-4">
        <div class="text-lg">Authentification en cours...</div>
      </div>

      <div v-else-if="error" class="space-y-4">
        <h1 class="text-2xl font-bold text-red-600">Erreur d'authentification</h1>
        <p class="text-gray-600">{{ error.message }}</p>
        <button 
          @click="navigateTo('/')"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour à l'accueil
        </button>
      </div>

      <div v-else-if="data?.success" class="space-y-4">
        <h1 class="text-2xl font-bold text-green-600">Authentification réussie</h1>
        <p class="text-gray-600">Redirection en cours...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const code = route.query.code as string;

if (!code) {
  navigateTo('/');
}

const { data, error, pending } = await useFetch('/api/auth/token', {
  query: { code }
});

// Rediriger après authentification réussie
watch(data, (newData) => {
  if (newData?.success) {
    navigateTo('/');
  }
}, { immediate: true });
</script> 