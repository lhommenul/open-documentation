import type { Turple } from "~/shared/types/Turple"

export interface AbstractTool {
    new: ( toolName: string ) => Turple<boolean>
    getName: () => string
}