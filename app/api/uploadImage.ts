import type { Turple } from "~/shared/types/Turple";
import { buildOpenCommunicationUrl } from "~/shared/utils/openCommunicationConfig";
import * as z from "zod";
 
export const UploadImageResponse = z.object({
  filename: z.string(),
  path: z.string(),
  url: z.string(),
  size: z.number(),
  mimetype: z.string()
});

export type UploadImageResponse = z.infer<typeof UploadImageResponse>;

export async function uploadImage(file: File): Promise<Turple<UploadImageResponse>> {
    
    try{

        console.log(file)

        const formData = new FormData();
        formData.append('image', file);

        const endpoint = buildOpenCommunicationUrl('/upload');
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            
        });

        if ( !response.ok ) {
            return [new Error('Failed to upload image: ' + response.statusText), null];
        }

        const data = await response.json();

        const result = UploadImageResponse.parse(data);

        return [null, result];


    } catch (error) {
        console.error(error)
        return [new Error('Failed to upload image'), null];

    }

}