import type { AbstractDocumentation } from './types/AbstractDocumentation'
import type { CID } from '../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractPicture } from '../picture/types/AbstractPicture'
import type { AbstractTool } from '../tool/types/AbstractTool'
import { Picture } from '~/schemas/picture/Picture'
import { Tool } from '../tool/Tool'

export class DocumentationVersion0001 implements AbstractDocumentation {
    private tools: AbstractTool[] = []
    private pictures: AbstractPicture[] = []
    private documentID: CID | null = null
    private content: string | null = null

    async new(): Promise<Turple<CID>> {

        this.documentID = crypto.randomUUID()

        return [null, this.documentID]

    }

    async save(): Promise<Turple<CID>> {
        return [null, "cid"]
    }

    getID(): CID | null {
        return this.documentID
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
        console.log(this.tools)
        return this.tools ?? []
    }

    addTool( toolName: string ): Turple<boolean> {

        const tool = new Tool()

        const response = tool.new( toolName )

        if ( !response[0] ) {

            const normalizeToolName = tool.getName();

            this.tools.push(tool)
        }

        return response;
    }

    removeTool( toolName: string ): void {

        this.tools = this.tools.filter( tool => tool.getName() === toolName );

    }

    getContent(): string | null {
        return this.content
    }

    setContent( content: string ): void {
        this.content = content
    }

}