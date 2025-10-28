export interface AbstractTool {
    getName: () => string
    setName: ( name: string ) => void
}