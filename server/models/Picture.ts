import mongoose from 'mongoose';

const PictureSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  rawFilename: {
    type: String,
    required: false
  }
}, {
  _id: false // Pas besoin d'ID pour les sous-documents
});

export default PictureSchema;

