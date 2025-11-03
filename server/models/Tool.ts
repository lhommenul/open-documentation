import { Schema } from 'mongoose';

const ToolSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  _id: false // Pas besoin d'ID pour les sous-documents
});

export default ToolSchema;

