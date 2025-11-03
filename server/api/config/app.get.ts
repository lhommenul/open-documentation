import { connectToDatabase } from '../../config/database';
import AppConfig from '../../models/AppConfig';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();
    
    // Récupérer la config du mode alpha
    let alphaConfig = await AppConfig.findOne({ key: 'alphaMode' });
    
    // Si la config n'existe pas, la créer avec la valeur par défaut (true pour activer le mode alpha)
    if (!alphaConfig) {
      alphaConfig = await AppConfig.create({
        key: 'alphaMode',
        value: true,
        description: 'Mode alpha - limite l\'accès à la page d\'accueil uniquement'
      });
    }
    
    return {
      alphaMode: alphaConfig.value as boolean,
      updatedAt: alphaConfig.updatedAt
    };
  } catch (error) {
    console.error('Error fetching app config:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching app configuration'
    });
  }
});

