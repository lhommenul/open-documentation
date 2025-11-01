import { readMultipartFormData } from 'h3';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { uploadConfig } from '../config/upload';

export default defineEventHandler(async (event) => {
  try {
    // Lire les données multipart/form-data
    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data received'
      });
    }

    // Trouver le fichier image dans les données
    const imageFile = formData.find(item => item.name === 'image');
    
    if (!imageFile || !imageFile.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No image uploaded'
      });
    }

    // Vérifier que c'est bien une image
    if (!imageFile.type?.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only image files are allowed'
      });
    }

    // Vérifier la taille
    if (imageFile.data.length > uploadConfig.maxFileSize) {
      throw createError({
        statusCode: 400,
        statusMessage: `File size must be less than ${uploadConfig.maxFileSize / 1024 / 1024}MB`
      });
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), uploadConfig.uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });

    // Générer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
    const normalizedFilename = `${uniqueSuffix}-normalized.jpg`;
    const normalizedPath = path.join(uploadDir, normalizedFilename);

    // Traiter l'image avec sharp
    const info = await sharp(imageFile.data)
      .rotate() // auto-orient basé sur EXIF
      .normalize() // améliorer contraste/luminosité
      .jpeg({ quality: uploadConfig.jpegQuality })
      .toFile(normalizedPath);

    // URL publique du fichier
    const fileUrl = `/uploads/${normalizedFilename}`;

    // Retourner les informations du fichier
    return {
      filename: normalizedFilename,
      path: path.join('public', 'uploads', normalizedFilename),
      url: fileUrl,
      size: info.size,
      mimetype: 'image/jpeg'
    };

  } catch (error: unknown) {
    console.error('Upload error:', error);
    
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

