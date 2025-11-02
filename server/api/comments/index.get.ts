import { defineEventHandler, getQuery } from 'h3';
import Comment from '../../models/Comment';
import connectDB from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const query = getQuery(event);
    const { documentationId, stepId } = query;

    if (!documentationId) {
      return {
        success: false,
        message: 'documentationId est requis'
      };
    }

    const filter: any = { documentationId: documentationId as string };

    if (stepId) {
      filter.stepId = stepId as string;
    }

    const comments = await Comment.find(filter).sort({ createdAt: -1 });

    return {
      success: true,
      data: comments,
      count: comments.length
    };
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la récupération des commentaires'
    };
  }
});

