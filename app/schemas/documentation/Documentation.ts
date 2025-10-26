import type { AbstractDocumentation } from './types/AbstractDocumentation'
import type { CID } from '../ipfs/Ipfs'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractPicture } from '../pictures/types/AbstractPicture'
import type { AbstractTool } from '../tool/types/AbstractTool'

export class DocumentationVersion0001 implements AbstractDocumentation {
    private tools: AbstractTool[] = []
    private pictures: AbstractPicture[] = []
    private currentCid: CID | null = null
    private content: string = ''

    async load(cid: CID): Promise<Turple<string>> {
        this.currentCid = cid
        this.content = `# Fake documentation\n\nLoaded from CID: ${cid}`
        return [null, this.content]
    }

    async new(): Promise<Turple<CID>> {

        return [null, "cid"]

    }

    async save(): Promise<Turple<CID>> {
        const fakeSavedCid: CID = this.currentCid ?? 'bafy-save-0001'
        return [null, fakeSavedCid]
    }

    async setTools(tools: AbstractTool[]): Promise<Turple<boolean>> {
        this.tools = tools
        return [null, true]
    }

    async setPictures(pictures: AbstractPicture[]): Promise<Turple<boolean>> {
        this.pictures = pictures
        return [null, true]
    }

}