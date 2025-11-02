import mongoose, { Schema, type Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  documentationId: string;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  documentationId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Index composé pour éviter les doublons et améliorer les performances
FavoriteSchema.index({ userId: 1, documentationId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

