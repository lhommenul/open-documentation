import type { AbstractPicture } from "./types/AbstractPicture";
import type { CID } from "../ipfs/Ipfs";
import type { Turple } from "~/shared/types/Turple";
import { uploadImage, type UploadImageResponse } from "~/api/uploadImage";

export class Picture implements AbstractPicture {

    private file: File | null = null;

    // Upload images url
    public uploadResponse: UploadImageResponse | null = null;

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
        return this.file?.name;
    }

    getObjectURL() {

        return window.URL.createObjectURL(this.file)

    }

    getFilename() {

        return this.uploadResponse?.filename;

    }

    getUrl() {
        return this.uploadResponse?.url
    }

}