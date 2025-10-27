import { DocumentationVersion0001 } from '../documentation/Documentation'
import type { AbstractOpenDocumentation } from './types/AbstractOpenDocumentation'
import type { AbstractDocumentation } from '../documentation/types/AbstractDocumentation'

export class OpenDocumentationVersion0001 implements AbstractOpenDocumentation {
    createDocumentation(): AbstractDocumentation {
        return new DocumentationVersion0001()
    }
    
}