import type { CID } from '../../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractTool } from '~/schemas/tool/types/AbstractTool'
import type { AbstractPicture } from '~/schemas/pictures/types/AbstractPicture'

export interface AbstractDocumentation {
    new: ( params?: {
        parentCID?: CID
        documentationCID?: CID // If you provide a documentationCID i will try to pull it
    } ) => Promise<Turple<CID>>
    save: () => Promise<Turple<CID>>
    getCID: () => CID | null
    getPictures: () => AbstractPicture[]
    getTools: () => AbstractTool[]
    getContent: () => string | null
    setContent: ( content: string ) => void
    setPictures: ( pictures: AbstractPicture[] ) => void
    setTools: ( tools: AbstractTool[] ) => void
}