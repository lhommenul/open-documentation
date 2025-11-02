import { defineEventHandler } from 'h3';
import Comment from '../../../models/Comment';
import connectDB from '../../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const commentId = event.context.params?.id;

    if (!commentId) {
      return {
        success: false,
        message: 'ID du commentaire requis'
      };
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!comment) {
      return {
        success: false,
        message: 'Commentaire non trouvé'
      };
    }

    return {
      success: true,
      data: comment,
      message: 'Like ajouté avec succès'
    };
  } catch (error: any) {
    console.error('Error liking comment:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de l\'ajout du like'
    };
  }
});

