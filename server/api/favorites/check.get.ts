import { defineEventHandler, getQuery } from 'h3';
import Favorite from '../../models/Favorite';
import connectDB from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const query = getQuery(event);
    const { userId, documentationId } = query;

    if (!userId || !documentationId) {
      return {
        success: false,
        message: 'userId et documentationId sont requis'
      };
    }

    const favorite = await Favorite.findOne({ 
      userId: userId as string, 
      documentationId: documentationId as string 
    });

    return {
      success: true,
      isFavorite: !!favorite
    };
  } catch (error: any) {
    console.error('Error checking favorite:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la vérification du favori'
    };
  }
});

