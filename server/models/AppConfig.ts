import mongoose, { Schema, type Document } from 'mongoose';

export interface IAppConfig extends Document {
  key: string;
  value: boolean | string | number;
  description?: string;
  updatedAt: Date;
}

const AppConfigSchema = new Schema<IAppConfig>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Éviter de recréer le modèle si il existe déjà (HMR support)
export default mongoose.models.AppConfig || mongoose.model<IAppConfig>('AppConfig', AppConfigSchema);

