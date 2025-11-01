import { connectToDatabase } from '../../config/database';
import Documentation from '../../models/Documentation';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'ID depuis les paramètres de route
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Documentation ID is required'
      });
    }

    // Connexion à MongoDB
    await connectToDatabase();

    // Supprimer le document
    const deletedDoc = await Documentation.findOneAndDelete({ id });

    if (!deletedDoc) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Documentation not found'
      });
    }

    return {
      success: true,
      message: 'Documentation deleted successfully',
      data: {
        id: deletedDoc.id,
        title: deletedDoc.title
      }
    };

  } catch (error: unknown) {
    console.error('Documentation deletion error:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

