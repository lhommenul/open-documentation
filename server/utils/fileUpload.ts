import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Assure que le dossier uploads existe
 */
export async function ensureUploadDir(): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

/**
 * Nettoie les vieux fichiers uploads (optionnel)
 * @param maxAgeMs Age maximum en millisecondes (par défaut 7 jours)
 */
export async function cleanOldUploads(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    const files = await fs.readdir(uploadDir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.unlink(filePath);
        console.log(`Deleted old upload: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning old uploads:', error);
  }
}

