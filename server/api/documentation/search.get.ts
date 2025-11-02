import { connectToDatabase } from '../../config/database';
import Documentation from '../../models/Documentation';

export default defineEventHandler(async (event) => {
  try {
    // Connexion à MongoDB
    await connectToDatabase();

    // Récupérer les paramètres de query
    const query = getQuery(event);
    const { q, limit = '20' } = query;

    if (!q || typeof q !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query parameter "q" is required'
      });
    }

    const limitNum = parseInt(limit as string, 10);

    // Recherche flexible avec regex (insensible à la casse)
    const searchRegex = new RegExp(q, 'i');
    
    // Recherche dans plusieurs champs avec OR
    const documentations = await Documentation
      .find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { brands: searchRegex },
          { 'tools.name': searchRegex }
        ]
      })
      .limit(limitNum)
      .sort({ updatedAt: -1 });

    return {
      success: true,
      query: q,
      results: documentations.length,
      data: documentations
    };

  } catch (error: unknown) {
    console.error('Documentation search error:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

