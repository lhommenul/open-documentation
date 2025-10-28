<template>
    <div class="h-screen w-screen flex flex-col gap-4" >

        <header class="col-span-1 row-span-1 bg-white-500 h-20 shadow-lg flex items-center px-8" >
            <h1 class="text-2xl font-bold" >Documentation</h1>
            
        </header>

        <main class="h-full w-full flex flex-row" >

            <div 
                class="w-6/8 grid grid-cols-2 gap-4" 
            >
                <div class="col-span-1" >
                    <FileUpload 
                        @select="onUpload" 
                        customUpload 
                        :multiple="true" 
                        auto
                        accept="image/*" 
                        :maxFileSize="1000000"
                        :showUploadButton="false"
                        :chooseLabel="'Ajouter des images'"
                    >
                        <template #empty>
                            <span>Drag and drop files to here to upload.</span>
                        </template>
                    </FileUpload>
                </div>

                <div class="col-span-1 flex flex-col gap-4" >
                    Ajouter des outils
                    <ul>
                        <li v-for="tool in tools" :key="tool.value" >
                            {{ tool.label }}
                            <Button icon="pi pi-times" @click="removeTool(tool.value)" label="Supprimer" />
                        </li>
                    </ul>

                    <InputText type="text" v-model="toolName" placeholder="Nom de l'outil" @keydown.enter="addTool" />
                </div>

                <div class="col-span-1" >
                    
                    <Editor v-model="activeDocumentContent" editorStyle="height: 320px" />

                </div>
            </div>

            <div class="col-span-1" >
                <PanelMenu :model="documents" />
            </div>

        </main>

        <footer class="h-20 w-full bg-white-500 shadow-lg flex items-center px-8" >
            FOOTER
        </footer>

    </div>
</template>

<script setup lang="ts">
import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation';
import { Picture } from '~/schemas/picture/Picture';
import { useToast } from 'primevue/usetoast';
import { DocumentationVersion0001 } from '~/schemas/documentation/Documentation';

const toast = useToast();

const documents = ref([{
    label: 'Document 1',
    icon: 'pi pi-file',
    items: []
}]);

const activeDocument = ref<AbstractDocumentation | null>(null);

const activeDocumentContent = computed({
    get: () => {
        return activeDocument.value?.getContent() ?? '';
    },
    set: (content: string) => {
        activeDocument.value?.setContent(content);
    }
});

const tools = ref([]);
const toolName = ref<string>('');

const addTool = () => {
    tools.value.push({
        label: toolName.value,
        value: toolName
    });
}

const onUpload = async (event: any) => {

    const file = event.files[0];

    if ( !file ) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Fichier non trouvé',
            life: 3000
        });
        return;
    }

    const [ error ] = await documentation.addPicture(file)

    if ( error ) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message,
            life: 3000
        });
    }
    
    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Images ajoutées avec succès',
        life: 3000
    });

}

const documentation = new DocumentationVersion0001();

onMounted(async () => {
    
});

</script>