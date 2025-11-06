import { defineEventHandler } from 'h3';
import Note from '../../models/Note';
import { connectToDatabase } from '../../config/database';

export default defineEventHandler(async (event) => {
  try {
    
    const noteId = event.context.params?.id;

    if (!noteId) {
      return {
        success: false,
        message: 'ID de la note requis'
      };
    }

    await connectToDatabase();

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return {
        success: false,
        message: 'Note non trouvée'
      };
    }

    return {
      success: true,
      message: 'Note supprimée avec succès'
    };
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la suppression de la note'
    };
  }
});

