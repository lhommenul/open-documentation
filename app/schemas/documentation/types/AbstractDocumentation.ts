import type { CID } from '../../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractTool } from '~/schemas/tool/types/AbstractTool'
import type { AbstractPicture } from '~/schemas/pictures/types/AbstractPicture'

export interface AbstractDocumentation {
    load: ( cid: CID ) => Promise<Turple<string>>
    new: () => Promise<Turple<CID>>
    save: () => Promise<Turple<CID>>
    setTools: ( tools: AbstractTool[] ) => Promise<Turple<boolean>>
    setPictures: ( pictures: AbstractPicture[] ) => Promise<Turple<boolean>>
}