export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ne pas exécuter le middleware côté serveur pour éviter les problèmes
  if (process.server) return;
  
  // La page d'accueil est toujours accessible
  if (to.path === '/') return;
  
  try {
    const { alphaMode, fetchAlphaMode } = useAlphaMode();
    
    // Récupérer le mode alpha si ce n'est pas déjà fait
    if (alphaMode.value === undefined) {
      await fetchAlphaMode();
    }
    
    // Si le mode alpha est activé, rediriger vers la page d'accueil
    if (alphaMode.value === true) {
      return navigateTo('/');
    }
  } catch (error) {
    console.error('Error in alpha middleware:', error);
    // En cas d'erreur, on laisse passer par sécurité
  }
});

