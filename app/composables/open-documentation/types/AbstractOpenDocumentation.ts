import type { AbstractDocumentation } from '../../documentation/types/AbstractDocumentation'

export interface AbstractOpenDocumentation {
    createDocumentation: () => AbstractDocumentation
}