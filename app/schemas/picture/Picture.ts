import type { AbstractPicture } from "./types/AbstractPicture";
import type { CID } from "../ipfs/Ipfs";
import type { Turple } from "~/shared/types/Turple";

export class Picture implements AbstractPicture {

    private name: string = '';
    private file: File | null = null;
    private cid: CID | null = null;
    private parentCID: CID | null = null;
    private url: string | null = null;

    new( file: File, parentCID: CID ): Turple<CID> {
        return [null, "cid"];
    }

    upload(): Promise<Turple<CID>> {

        if ( !this.file ) {
            return [new Error("File not found"), null];
        }

        return uploadImage(this.file);

    }

    getPreviewURL(): Turple<string>{

        if ( !this.file ) {
            return [new Error("File not found"), null];
        }

        const url = URL.createObjectURL(this.file);

        return [null, url];

    }

}