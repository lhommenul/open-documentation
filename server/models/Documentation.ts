import mongoose, { Schema, type Document } from 'mongoose';
import ToolSchema from './Tool';
import PictureSchema from './Picture';

export interface IDocumentation extends Document {
  id: string;
  content: string | null;
  order: number;
  title?: string;
  brands: string[];
  tools: Array<{ name: string }>;
  pictures: Array<{
    filename?: string;
    url?: string;
    rawFilename?: string;
  }>;
  children: IDocumentation[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentationSchema = new Schema<IDocumentation>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  content: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  title: {
    type: String,
    required: false
  },
  brands: {
    type: [String],
    default: []
  },
  tools: {
    type: [ToolSchema],
    default: []
  },
  pictures: {
    type: [PictureSchema],
    default: []
  },
  children: {
    type: [Schema.Types.Mixed],
    default: []
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Index pour améliorer les performances de recherche
DocumentationSchema.index({ createdAt: -1 });
DocumentationSchema.index({ title: 'text', content: 'text' });

// Éviter de recréer le modèle si il existe déjà (HMR support)
export default mongoose.models.Documentation || mongoose.model<IDocumentation>('Documentation', DocumentationSchema);

