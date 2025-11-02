import { defineEventHandler, readBody } from 'h3';
import Favorite from '../../models/Favorite';
import connectDB from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { userId, documentationId } = body;

    if (!userId || !documentationId) {
      return {
        success: false,
        message: 'userId et documentationId sont requis'
      };
    }

    // Vérifier si le favori existe déjà
    const existingFavorite = await Favorite.findOne({ userId, documentationId });

    if (existingFavorite) {
      // Supprimer le favori
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return {
        success: true,
        isFavorite: false,
        message: 'Retiré des favoris'
      };
    } else {
      // Ajouter aux favoris
      const newFavorite = await Favorite.create({ userId, documentationId });
      return {
        success: true,
        isFavorite: true,
        data: newFavorite,
        message: 'Ajouté aux favoris'
      };
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du favori'
    };
  }
});

