import type { UploadImageResponse } from "~/api/uploadImage";
import type { Turple } from "~/shared/types/Turple";

export interface AbstractPicture {
    getRawFilename: () => string
    getObjectURL: () => string
    getFilename: () => string
    getUrl: () => string
    upload: ( file: File ) => Promise<Turple<UploadImageResponse>>
}