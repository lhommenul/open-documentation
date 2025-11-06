<template>
  <div class="container mx-auto p-6">
    <div v-if="isLoading" class="text-center">
      <p>Vérification de l'authentification...</p>
    </div>

    <div v-else-if="!isAuthenticated" class="text-center space-y-4">
      <h1 class="text-2xl font-bold">Accès restreint</h1>
      <p class="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
      <button 
        @click="login"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Se connecter
      </button>
    </div>

    <div v-else class="space-y-4">
      <h1 class="text-2xl font-bold">Profil</h1>
      <p class="text-gray-600">Vous êtes authentifié !</p>
      <button 
        @click="logout"
        class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, isLoading, checkAuth, login, logout } = useAuth();

// Vérifier l'authentification au chargement de la page
onMounted(async () => {
  await checkAuth();
});
</script>

