import { defineEventHandler, readBody } from 'h3';
import Note from '../../models/Note';
import connectDB from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const noteId = event.context.params?.id;
    const body = await readBody(event);
    const { content, color, position } = body;

    if (!noteId) {
      return {
        success: false,
        message: 'ID de la note requis'
      };
    }

    const updateData: any = {};
    if (content !== undefined) updateData.content = content;
    if (color !== undefined) updateData.color = color;
    if (position !== undefined) updateData.position = position;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      updateData,
      { new: true }
    );

    if (!updatedNote) {
      return {
        success: false,
        message: 'Note non trouvée'
      };
    }

    return {
      success: true,
      data: updatedNote,
      message: 'Note mise à jour avec succès'
    };
  } catch (error: any) {
    console.error('Error updating note:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la note'
    };
  }
});

