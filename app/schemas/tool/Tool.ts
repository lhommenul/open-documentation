import type { AbstractTool } from "./types/AbstractTool";

export class Tool implements AbstractTool {
    private name: string = '';

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
    
}