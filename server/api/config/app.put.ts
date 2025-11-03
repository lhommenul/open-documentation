import { connectToDatabase } from '../../config/database';
import AppConfig from '../../models/AppConfig';

export default defineEventHandler(async (event) => {
  try {
    await connectToDatabase();
    
    const body = await readBody(event);
    const { alphaMode } = body;
    
    if (typeof alphaMode !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'alphaMode must be a boolean'
      });
    }
    
    // Mettre à jour ou créer la config
    const config = await AppConfig.findOneAndUpdate(
      { key: 'alphaMode' },
      { 
        key: 'alphaMode',
        value: alphaMode,
        description: 'Mode alpha - limite l\'accès à la page d\'accueil uniquement'
      },
      { upsert: true, new: true }
    );
    
    return {
      alphaMode: config.value as boolean,
      updatedAt: config.updatedAt,
      message: 'Configuration updated successfully'
    };
  } catch (error) {
    console.error('Error updating app config:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error updating app configuration'
    });
  }
});

