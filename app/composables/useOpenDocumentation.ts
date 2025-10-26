import { OpenDocumentationVersion0001 } from '~/schemas/open-documentation/OpenDocumentation';
import type { AbstractOpenDocumentation } from '~/schemas/open-documentation/types/AbstractOpenDocumentation';

const openDocumentation: Ref<AbstractOpenDocumentation | null> = ref(null);

const isInitialized: Ref<boolean> = ref(false);

const isLoading: Ref<boolean> = ref(false);

export const useOpenDocumentation = () => {

    const initialize = async () => {

        isLoading.value = true;

        openDocumentation.value = new OpenDocumentationVersion0001();

        isInitialized.value = true;

        isLoading.value = false;

    }

    return {
        initialize,
        isLoading,
        isInitialized
    }
}