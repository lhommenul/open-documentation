import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation';
import { OpenDocumentationVersion0001 } from '~/schemas/open-documentation/OpenDocumentation';
import type { AbstractOpenDocumentation } from '~/schemas/open-documentation/types/AbstractOpenDocumentation';
import { useToast } from 'primevue/usetoast';

const application: Ref<AbstractOpenDocumentation | null> = ref(null);

const isLoading: Ref<boolean> = ref(true);

export const useDocumentation = () => {
    
    const toast = useToast();

    const initialize = async ( openDocumentation: AbstractOpenDocumentation ) => {

        isLoading.value = true;

        application.value = openDocumentation;

        isLoading.value = false;

    }

    const newDocumentation = async () => {

        isLoading.value = true;

        if ( !application.value ) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Application non initialisée',
                life: 3000
            });
            isLoading.value = false;
            return null;
        }

        const documentation = application.value?.createDocumentation();

        if ( !documentation ) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Documentation non créée',
                life: 3000
            });
            isLoading.value = false;
            return null;
        }

        const [ error, cid ] = await documentation.new();

        if ( error ) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: error.message,
                life: 3000
            });
            isLoading.value = false;
            return null;
        }

        isLoading.value = false;

        return cid;

    }

    return {
        initialize,
        isLoading,
        newDocumentation
    }
}