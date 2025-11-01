/**
 * Configuration pour les uploads d'images
 */
export const uploadConfig = {
  // Taille maximale des fichiers en bytes (5MB)
  maxFileSize: 5 * 1024 * 1024,
  
  // Qualité JPEG pour les images traitées
  jpegQuality: 85,
  
  // Dossier de destination des uploads
  uploadDir: 'public/uploads',
  
  // Age maximum des fichiers avant nettoyage (7 jours en ms)
  maxFileAge: 7 * 24 * 60 * 60 * 1000,
  
  // Types MIME acceptés
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
} as const;

