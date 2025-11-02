import type { AbstractPicture } from "./types/AbstractPicture";
import type { CID } from "../ipfs/Ipfs";
import type { Turple } from "~/shared/types/Turple";
import { uploadImage, type UploadImageResponse } from "~/api/uploadImage";

export class Picture implements AbstractPicture {

    private file: File | null = null;

    // Upload images url
    public uploadResponse: UploadImageResponse | null = null;

    /**
     * Restaure une Picture à partir de données MongoDB
     */
    static fromData(data: { filename?: string; url?: string; rawFilename?: string }): Picture {
        const picture = new Picture();
        
        if (data.filename || data.url) {
            picture.uploadResponse = {
                filename: data.filename || '',
                url: data.url || '',
                path: '',
                size: 0,
                mimetype: ''
            };
        }
        
        return picture;
    }

    async upload( file: File ): Promise<Turple<UploadImageResponse>> {

        if ( !file ) {
            return Promise.resolve([new Error("File not found"), null]);
        }

        this.file = file;

        const uploadImageResponse = await uploadImage(file);

        if ( uploadImageResponse[0] === null ) {
            this.uploadResponse = uploadImageResponse[1];
        }

        return uploadImageResponse;

    }

    getRawFilename() {
        return this.file?.name || this.uploadResponse?.filename || '';
    }

    getObjectURL() {
        // Si on a un fichier local, utiliser l'object URL
        if (this.file) {
            return window.URL.createObjectURL(this.file);
        }
        
        // Sinon, utiliser l'URL depuis le serveur
        return this.uploadResponse?.url || '';
    }

    getFilename() {
        return this.uploadResponse?.filename || '';
    }

    getUrl() {
        return this.uploadResponse?.url || '';
    }

}