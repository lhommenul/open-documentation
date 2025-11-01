import { randomUUID } from 'node:crypto';

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

    // TODO: Persister la documentation ici (DB/IPFS) quand disponible
    console.log('Documentation received:', {
      id: documentationId,
      title: body.title,
      childrenCount,
      toolsCount: body.tools.length,
      picturesCount: body.pictures.length
    });

    // Retourner la réponse de succès
    return {
      documentationId,
      message: 'Documentation uploaded successfully',
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

