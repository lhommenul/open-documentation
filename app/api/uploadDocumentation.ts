import type { Turple } from "~/shared/types/Turple";
import type { AbstractDocumentation } from "~/schemas/documentation/types/AbstractDocumentation";
import * as z from "zod";

// Schéma Zod pour la réponse d'upload de documentation
export const UploadDocumentationResponse = z.object({
  documentationId: z.string(),
  message: z.string(),
  childrenCount: z.number().optional(),
  uploadedAt: z.string().optional()
});

export type UploadDocumentationResponse = z.infer<typeof UploadDocumentationResponse>;

// Interface pour les données à envoyer
interface DocumentationPayload {
  id: string | null;
  content: string | null;
  order: number;
  title?: string;
  tools: Array<{ name: string }>;
  pictures: Array<{
    filename: string | undefined;
    url: string | undefined;
    rawFilename: string | undefined;
  }>;
  children: DocumentationPayload[];
}

/**
 * Sérialise une documentation et ses enfants en payload
 */
function serializeDocumentation(
  documentation: AbstractDocumentation, 
  title?: string
): DocumentationPayload {
  const tools = documentation.getTools().map(tool => ({
    name: tool.getName()
  }));

  const pictures = documentation.getPictures().map(picture => ({
    filename: picture.getFilename(),
    url: picture.getUrl(),
    rawFilename: picture.getRawFilename()
  }));

  const children = documentation.getChildrenDocumentations().map(child => 
    serializeDocumentation(child)
  );

  return {
    id: documentation.getID(),
    content: documentation.getContent(),
    order: documentation.getOrder(),
    title,
    tools,
    pictures,
    children
  };
}

/**
 * Upload une documentation complète avec ses étapes (children)
 * @param documentation - La documentation mère à uploader
 * @param title - Le titre optionnel de la documentation
 * @returns Une Turple contenant soit une erreur, soit la réponse d'upload
 */
export async function uploadDocumentation(
  documentation: AbstractDocumentation,
  title?: string
): Promise<Turple<UploadDocumentationResponse>> {
  try {
    // Sérialiser la documentation et ses enfants
    const payload = serializeDocumentation(documentation, title);

    console.log('Uploading documentation with payload:', payload);

    // Utiliser l'API locale Nuxt
    const response = await fetch('/api/documentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return [
        new Error(`Failed to upload documentation: ${response.statusText}`),
        null
      ];
    }

    const data = await response.json();
    const result = UploadDocumentationResponse.parse(data);

    return [null, result];
  } catch (error) {
    console.error('Upload documentation error:', error);
    return [
      new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload documentation'
      ),
      null
    ];
  }
}

/**
 * Upload plusieurs documentations (étapes) en tant qu'enfants d'une documentation mère
 * @param parentDocumentation - La documentation mère
 * @param childrenDocumentations - Les documentations enfants (étapes) avec leurs titres
 * @param parentTitle - Le titre optionnel de la documentation mère
 * @returns Une Turple contenant soit une erreur, soit la réponse d'upload
 */
export async function uploadDocumentationWithSteps(
  parentDocumentation: AbstractDocumentation,
  childrenDocumentations: Array<{ documentation: AbstractDocumentation; title?: string }>,
  parentTitle?: string
): Promise<Turple<UploadDocumentationResponse>> {
  try {
    // Ajouter tous les enfants à la documentation mère
    for (const child of childrenDocumentations) {
      parentDocumentation.addChildrenDocumentation(child.documentation);
    }

    // Upload la documentation mère avec tous ses enfants
    return await uploadDocumentation(parentDocumentation, parentTitle);
  } catch (error) {
    console.error('Upload documentation with steps error:', error);
    return [
      new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to upload documentation with steps'
      ),
      null
    ];
  }
}

