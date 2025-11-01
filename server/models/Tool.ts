import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  _id: false // Pas besoin d'ID pour les sous-documents
});

export default ToolSchema;

