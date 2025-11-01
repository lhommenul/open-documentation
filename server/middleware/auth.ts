/**
 * Middleware d'authentification (placeholder)
 * À implémenter selon vos besoins (JWT, session, etc.)
 */
export default defineEventHandler((event) => {
  // Pour l'instant, on laisse passer toutes les requêtes
  // Vous pouvez ajouter votre logique d'authentification ici
  
  // Exemple de vérification d'un token Bearer:
  // const authHeader = getHeader(event, 'authorization');
  // if (!authHeader?.startsWith('Bearer ')) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Unauthorized'
  //   });
  // }
  
  return;
});

