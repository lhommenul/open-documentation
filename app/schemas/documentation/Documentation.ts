import type { AbstractDocumentation } from './types/AbstractDocumentation'
import type { CID } from '../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractPicture } from '../picture/types/AbstractPicture'
import type { AbstractTool } from '../tool/types/AbstractTool'
import { Picture } from '~/schemas/picture/Picture'

export class DocumentationVersion0001 implements AbstractDocumentation {
    private tools: AbstractTool[] = []
    private pictures: AbstractPicture[] = []
    private currentCID: CID | null = null
    private content: string | null = null
    private parentCID: CID | null = null

    // Create a new documentation / if you provide a DocumentCID i will try to pull it
    async new(): Promise<Turple<CID>> {

        return [null, "cid"]

    }

    async save(): Promise<Turple<CID>> {
        return [null, "cid"]
    }

    getCID(): CID | null {
        return this.currentCID
    }

    getPictures(): AbstractPicture[] {
        return this.pictures
    }

    async addPicture( file: File ) {
        
        const picture = new Picture()

        const pictureUploadResponse = await picture.upload( file )

        if ( !pictureUploadResponse[0] ) {
            this.pictures.push(picture)
        }

        return pictureUploadResponse

    }

    getTools(): AbstractTool[] {
        return this.tools
    }

    setTools( tools: AbstractTool[] ): void {
        this.tools = tools
    }

    getContent(): string | null {
        return this.content
    }

    setContent( content: string ): void {
        this.content = content
    }

}