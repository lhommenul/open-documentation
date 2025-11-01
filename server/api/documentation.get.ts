import { connectToDatabase } from '../config/database';
import Documentation from '../models/Documentation';

export default defineEventHandler(async (event) => {
  try {
    // Connexion à MongoDB
    await connectToDatabase();

    // Récupérer les paramètres de query
    const query = getQuery(event);
    const { id, limit = '50', skip = '0', sortBy = 'createdAt', order = 'desc' } = query;

    // Si un ID est fourni, récupérer un document spécifique
    if (id) {
      const documentation = await Documentation.findOne({ id: id as string });
      
      if (!documentation) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Documentation not found'
        });
      }

      return {
        success: true,
        data: documentation
      };
    }

    // Sinon, récupérer une liste de documentations avec pagination
    const limitNum = parseInt(limit as string, 10);
    const skipNum = parseInt(skip as string, 10);
    const sortOrder = order === 'asc' ? 1 : -1;

    const documentations = await Documentation
      .find()
      .sort({ [sortBy as string]: sortOrder })
      .limit(limitNum)
      .skip(skipNum);

    const total = await Documentation.countDocuments();

    return {
      success: true,
      data: documentations,
      pagination: {
        total,
        limit: limitNum,
        skip: skipNum,
        hasMore: skipNum + limitNum < total
      }
    };

  } catch (error: unknown) {
    console.error('Documentation fetch error:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

