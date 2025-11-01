import type { CID } from '../../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractTool } from '~/schemas/tool/types/AbstractTool'
import type { AbstractPicture } from '~/schemas/picture/types/AbstractPicture'

export interface AbstractDocumentation {
    new: () => Promise<Turple<CID>>
    save: () => Promise<Turple<CID>>
    getID: () => CID | null
    getOrder: () => number
    setOrder: ( order: number ) => void
    getChildrenDocumentations: () => AbstractDocumentation[]
    addChildrenDocumentation: ( documentation: AbstractDocumentation ) => void
    removeChildrenDocumentation: ( documentID: CID ) => void
    getPictures: () => AbstractPicture[]
    addPicture: ( file: File ) => Promise<Turple<AbstractPicture>>
    getTools: () => AbstractTool[]
    removeTool: (toolName: string) => void
    getContent: () => string | null
    setContent: ( content: string ) => void
    addTool: ( toolName: string ) => Turple<boolean>
}