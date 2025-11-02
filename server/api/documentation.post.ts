import { randomUUID } from 'node:crypto';
import { connectToDatabase } from '../config/database';
import Documentation from '../models/Documentation';

// Interface pour le payload de documentation
interface ToolPayload {
  name: string;
}

interface PicturePayload {
  filename?: string;
  url?: string;
  rawFilename?: string;
}

interface DocumentationPayload {
  id: string | null;
  content: string | null;
  order: number;
  title?: string;
  brands?: string[];
  tools: ToolPayload[];
  pictures: PicturePayload[];
  children: DocumentationPayload[];
}

// Validation helper functions
const isStringOrNull = (v: any): boolean => 
  typeof v === 'string' || v === null || typeof v === 'undefined';

const isNumber = (v: any): boolean => 
  typeof v === 'number' && Number.isFinite(v);

const hasArray = (v: any): boolean => 
  Array.isArray(v);

// Compter récursivement les enfants
const countChildren = (nodes: any[]): number => {
  if (!Array.isArray(nodes)) return 0;
  let count = 0;
  for (const node of nodes) {
    count += 1;
    count += countChildren(node?.children);
  }
  return count;
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<DocumentationPayload>(event);

    // Validation de la structure de base
    if (!isStringOrNull(body?.id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: id'
      });
    }

    if (!isStringOrNull(body?.content)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: content'
      });
    }

    if (!isNumber(body?.order)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: order'
      });
    }

    if (typeof body?.title !== 'undefined' && typeof body?.title !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: title'
      });
    }

    if (typeof body?.brands !== 'undefined' && !Array.isArray(body?.brands)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: brands (must be an array)'
      });
    }

    // Validation des brands
    if (body?.brands) {
      for (const brand of body.brands) {
        if (typeof brand !== 'string') {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid brand entry: expected string'
          });
        }
      }
    }

    if (!hasArray(body?.tools)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: tools'
      });
    }

    if (!hasArray(body?.pictures)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: pictures'
      });
    }

    if (!hasArray(body?.children)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid field: children'
      });
    }

    // Validation des outils
    for (const tool of body.tools) {
      if (!tool || typeof tool?.name !== 'string') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid tool entry: expected { name: string }'
        });
      }
    }

    // Validation des images
    for (const picture of body.pictures) {
      const ok =
        (typeof picture?.filename === 'string' || typeof picture?.filename === 'undefined') &&
        (typeof picture?.url === 'string' || typeof picture?.url === 'undefined') &&
        (typeof picture?.rawFilename === 'string' || typeof picture?.rawFilename === 'undefined');
      
      if (!ok) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid picture entry'
        });
      }
    }

    // Générer un ID si nécessaire
    const documentationId = body?.id || randomUUID();
    const childrenCount = countChildren(body.children);
    const uploadedAt = new Date().toISOString();

    // Connexion à MongoDB
    await connectToDatabase();

    // Vérifier si un document avec cet ID existe déjà
    const existingDoc = await Documentation.findOne({ id: documentationId });

    if (existingDoc) {
      // Mettre à jour le document existant
      existingDoc.content = body.content;
      existingDoc.order = body.order;
      existingDoc.title = body.title;
      existingDoc.brands = body.brands || [];
      existingDoc.tools = body.tools;
      existingDoc.pictures = body.pictures;
      existingDoc.children = body.children as any;
      
      await existingDoc.save();
      
      console.log('Documentation updated:', {
        id: documentationId,
        title: body.title,
        childrenCount,
        toolsCount: body.tools.length,
        picturesCount: body.pictures.length
      });
    } else {
      // Créer un nouveau document
      const newDocumentation = new Documentation({
        id: documentationId,
        content: body.content,
        order: body.order,
        title: body.title,
        brands: body.brands || [],
        tools: body.tools,
        pictures: body.pictures,
        children: body.children
      });

      await newDocumentation.save();
      
      console.log('Documentation created:', {
        id: documentationId,
        title: body.title,
        childrenCount,
        toolsCount: body.tools.length,
        picturesCount: body.pictures.length
      });
    }

    // Retourner la réponse de succès
    return {
      documentationId,
      message: existingDoc ? 'Documentation updated successfully' : 'Documentation created successfully',
      childrenCount,
      uploadedAt
    };

  } catch (error: unknown) {
    console.error('Documentation upload error:', error);

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload documentation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

