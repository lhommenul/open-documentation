import { defineEventHandler } from 'h3';
import Comment from '../../models/Comment';
import { connectToDatabase } from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    
    const commentId = event.context.params?.id;

    if (!commentId) {
      return {
        success: false,
        message: 'ID du commentaire requis'
      };
    }

    await connectToDatabase();

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return {
        success: false,
        message: 'Commentaire non trouvé'
      };
    }

    // Supprimer aussi les réponses à ce commentaire
    await Comment.deleteMany({ parentId: commentId });

    return {
      success: true,
      message: 'Commentaire supprimé avec succès'
    };
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la suppression du commentaire'
    };
  }
});

