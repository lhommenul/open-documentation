import type { Turple } from "~/shared/types/Turple";
import type { AbstractTool } from "./types/AbstractTool";

export class Tool implements AbstractTool {

    private toolName: string = '';
    private rawToolName: string = ''

    new( toolName:string ): Turple<boolean> {

        const normalizedToolName = toolName.toLowerCase().trim();

        if ( normalizedToolName === '' ) return [new Error('Nom d\'outil vide'),null]
     
        this.toolName = toolName.toLowerCase().trim();

        this.rawToolName = toolName;

        return [null, true]

    }

    getName(): string {
        return this.toolName;
    }
    
}