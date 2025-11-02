import mongoose, { Schema, type Document } from 'mongoose';

export interface INote extends Document {
  userId: string;
  documentationId: string;
  stepId?: string; // ID de l'étape spécifique si la note est pour une étape
  content: string;
  color?: string; // Couleur de la note pour catégorisation
  position?: number; // Position dans le contenu
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentationId: {
    type: String,
    required: true,
    index: true
  },
  stepId: {
    type: String,
    required: false
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'yellow',
    enum: ['yellow', 'blue', 'green', 'red', 'purple', 'orange']
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour rechercher les notes par utilisateur et documentation
NoteSchema.index({ userId: 1, documentationId: 1 });
NoteSchema.index({ userId: 1, stepId: 1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

