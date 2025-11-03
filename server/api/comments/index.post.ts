import { defineEventHandler, readBody } from 'h3';
import Comment from '../../models/Comment';
import { connectToDatabase } from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    
    const body = await readBody(event);
    const { userId, userName, documentationId, stepId, content, parentId } = body;

    if (!userId || !userName || !documentationId || !content) {
      return {
        success: false,
        message: 'userId, userName, documentationId et content sont requis'
      };
    }

    await connectToDatabase();

    const newComment = await Comment.create({
      userId,
      userName,
      documentationId,
      stepId,
      content,
      parentId,
      likes: 0
    });

    return {
      success: true,
      data: newComment,
      message: 'Commentaire créé avec succès'
    };
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la création du commentaire'
    };
  }
});

