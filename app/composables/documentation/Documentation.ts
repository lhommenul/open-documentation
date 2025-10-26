import type { AbstractDocumentation } from './types/AbstractDocumentation'

export class DocumentationVersion0001 implements AbstractDocumentation {
    newDocumentation(): AbstractDocumentation {
        return new DocumentationVersion0001()
    }
}