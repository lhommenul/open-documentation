import { defineEventHandler, readBody } from 'h3';
import Note from '../../models/Note';
import connectDB from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { userId, documentationId, stepId, content, color, position } = body;

    if (!userId || !documentationId || !content) {
      return {
        success: false,
        message: 'userId, documentationId et content sont requis'
      };
    }

    const newNote = await Note.create({
      userId,
      documentationId,
      stepId,
      content,
      color: color || 'yellow',
      position: position || 0
    });

    return {
      success: true,
      data: newNote,
      message: 'Note créée avec succès'
    };
  } catch (error: any) {
    console.error('Error creating note:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la création de la note'
    };
  }
});

