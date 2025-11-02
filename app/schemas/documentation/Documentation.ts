import type { AbstractDocumentation } from './types/AbstractDocumentation'
import type { Turple } from '~/shared/types/Turple'
import type { AbstractPicture } from '../picture/types/AbstractPicture'
import type { AbstractTool } from '../tool/types/AbstractTool'
import { Picture } from '~/schemas/picture/Picture'
import { Tool } from '../tool/Tool'

export class DocumentationVersion0001 implements AbstractDocumentation {
    private tools: AbstractTool[] = []
    private pictures: AbstractPicture[] = []
    private documentID: string | null = null
    private content: string | null = null
    private order: number = 0
    private brands: string[] = []
    
    private childrenDocumentations: AbstractDocumentation[] = []

    async new(): Promise<Turple<string>> {

        this.documentID = crypto.randomUUID()

        return [null, this.documentID]

    }

    setOrder( order: number ): void {
        this.order = order
    }

    getOrder(): number {
        return this.order
    }

    getChildrenDocumentations(): AbstractDocumentation[] {
        return this.childrenDocumentations
    }

    addChildrenDocumentation( documentation: AbstractDocumentation ): void {
        this.childrenDocumentations.push(documentation)
    }

    removeChildrenDocumentation( documentID: string ): void {
        this.childrenDocumentations = this.childrenDocumentations.filter( doc => doc.getID() !== documentID )
    }

    async save(): Promise<Turple<string>> {
        return [null, "string"]
    }

    getID(): string | null {
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

    addExistingPicture( picture: AbstractPicture ): void {
        this.pictures.push(picture)
    }

    removePicture( filename: string ): void {
        this.pictures = this.pictures.filter( picture => picture.getRawFilename() !== filename )
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

    getBrands(): string[] {
        return this.brands
    }

    setBrands( brands: string[] ): void {
        this.brands = brands
    }

    addBrand( brand: string ): void {
        if ( !this.brands.includes(brand) ) {
            this.brands.push(brand)
        }
    }

    removeBrand( brand: string ): void {
        this.brands = this.brands.filter( b => b !== brand )
    }

}