import type { Turple } from "~/shared/types/Turple";
import type { AbstractTool } from "./types/AbstractTool";

export class Tool implements AbstractTool {

    private toolName: string = '';

    new( toolName:string ): Turple<boolean> {
     
        this.toolName = toolName;

        return [null, true]

    }

    getName(): string {
        return this.toolName;
    }
    
}