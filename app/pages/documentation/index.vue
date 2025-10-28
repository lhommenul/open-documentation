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
                    <ul v-if="activeDocumentation" >
                        <li v-for="(tool,index) in activeDocumentation?.getTools()" :key="index" >
                            {{ tool.getName() }}
                            <Button icon="pi pi-times" @click="activeDocumentation?.removeTool(tool.getName())" label="Supprimer" />
                        </li>
                    </ul>

                    <InputText type="text" v-model="toolName" placeholder="Nom de l'outil" @keydown.enter="handleAddTool" />
                </div>

                <div class="col-span-1" >
                    
                    <Editor v-model="activeDocumentContent" editorStyle="height: 320px" />

                </div>
            </div>

            <div class="col-span-1 gap-8 flex flex-col" >
                <PanelMenu :model="panelMenuItems" />

                <Button label="Ajouter une documentation" @click="addNewDocumentation"  />
            </div>

        </main>

        <footer class="h-20 w-full bg-white-500 shadow-lg flex items-center px-8" >
            FOOTER
        </footer>

    </div>
</template>

<script setup lang="ts">
import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation';
import { useToast } from 'primevue/usetoast';
import { DocumentationVersion0001 } from '~/schemas/documentation/Documentation';

const toast = useToast();

const activeDocumentID = ref();

const documentations = ref<AbstractDocumentation[]>([]);

const activeDocumentation = computed(()=> documentations.value.find( doc => doc.getID() === activeDocumentID.value ) )

const panelMenuItems = computed(()=>{
    return documentations.value.map( doc => {
        return {
            label: doc.getID(),
            command: () => {
                activeDocumentID.value = doc.getID()
            }
        }
    })
})

const activeDocumentContent = computed({
    get: () => {
        return activeDocumentation.value?.getContent() ?? '';
    },
    set: (content: string) => {
        activeDocumentation.value?.setContent(content);
    }
});

const handleAddTool = () => {

    activeDocumentation.value?.addTool(toolName.value)

    toolName.value = '';
}

const toolName = ref<string>('');

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

    if ( !activeDocumentation.value ) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Aucun document actif',
            life: 3000
        });
        return
    }

    const [ error ] = await activeDocumentation.value?.addPicture(file)

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


const addNewDocumentation = async () => {

    const documentation = new DocumentationVersion0001();

    const [ error, documentID ] = await documentation.new()
    
    documentations.value.push(documentation);

    activeDocumentID.value = documentID;
    
}

onMounted(async () => {

    const documentation = new DocumentationVersion0001();

    const [ error, documentID ] = await documentation.new()
    
    documentations.value.push(documentation);

    activeDocumentID.value = documentID;

});

</script>