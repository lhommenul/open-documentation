import type { CID } from '../../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractTool } from '~/composables/tool/types/AbstractTool'
import type { AbstractPicture } from '~/composables/pictures/types/AbstractPicture'

export interface AbstractDocumentation {
    loadDocumentation: ( cid: CID ) => Promise<Turple<string>>
    createDocumentation: () => Promise<Turple<CID>>
    saveDocumentation: () => Promise<Turple<CID>>
    setTools: ( tools: AbstractTool[] ) => Promise<Turple<boolean>>
    setPictures: ( pictures: AbstractPicture[] ) => Promise<Turple<boolean>>
}