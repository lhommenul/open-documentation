import { OpenDocumentationVersion0001 } from '~/schemas/open-documentation/OpenDocumentation';
import type { AbstractOpenDocumentation } from '~/schemas/open-documentation/types/AbstractOpenDocumentation';
import { useDocumentation } from './useDocumentation';

const openDocumentation: Ref<AbstractOpenDocumentation | null> = ref(null);

const isInitialized: Ref<boolean> = ref(false);

const isLoading: Ref<boolean> = ref(true);

export const useOpenDocumentation = () => {

    const initialize = async () => {

        isLoading.value = true;

        openDocumentation.value = new OpenDocumentationVersion0001();

        await useDocumentation().initialize(openDocumentation.value);

        isInitialized.value = true;

        isLoading.value = false;

    }

    return {
        initialize,
        isLoading,
        isInitialized
    }
}