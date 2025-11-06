import { defineEventHandler, getQuery } from 'h3';
import Note from '../../models/Note';
import { connectToDatabase } from '../../config/database';

export default defineEventHandler(async (event) => {
  try {

    const query = getQuery(event);
    const { userId, documentationId, stepId } = query;

    if (!userId || !documentationId) {
      return {
        success: false,
        message: 'userId et documentationId sont requis'
      };
    }

    await connectToDatabase();

    const filter: any = { 
      userId: userId as string, 
      documentationId: documentationId as string 
    };

    if (stepId) {
      filter.stepId = stepId as string;
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });

    return {
      success: true,
      data: notes,
      count: notes.length
    };
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la récupération des notes'
    };
  }
});

