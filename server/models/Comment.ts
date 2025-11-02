import mongoose, { Schema, type Document } from 'mongoose';

export interface IComment extends Document {
  userId: string;
  userName: string; // Nom de l'utilisateur pour affichage
  documentationId: string;
  stepId?: string; // ID de l'étape spécifique si le commentaire est pour une étape
  content: string;
  parentId?: string; // Pour les réponses aux commentaires
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
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
  parentId: {
    type: String,
    required: false
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour rechercher les commentaires par documentation
CommentSchema.index({ documentationId: 1, createdAt: -1 });
CommentSchema.index({ stepId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

