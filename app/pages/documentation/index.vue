<template>
    <div class="h-screen w-screen flex flex-col gap-4" >

        <header class="col-span-1 row-span-1 bg-white-500 h-20 shadow-lg flex items-center px-8" >
            <h1 class="text-2xl font-bold" >Documentation</h1>
            
        </header>

        <main class="h-full w-full grid grid-cols-4 gap-4 px-8 py-4" >

            <div class="col-span-3 h-full flex flex-col" >

                <div class="" >
                    <Stepper value="1" >
                        <StepItem value="1">
                            <Step>Header I</Step>
                            <StepPanel v-slot="{ activateCallback }">
                                <div class="col-span-1" >
                                    <FileUpload 
                                        @select="onUpload" 
                                        customUpload 
                                        :multiple="true" 
                                        accept="image/*" 
                                        :maxFileSize="1000000"
                                        :showUploadButton="false"
                                        :chooseLabel="'Ajouter des images'"
                                    >
                                        <template #content="{ files }">
                                            <ul>
                                                <li v-for="file in computeUploadedPicturesStatus(files)" class="flex flex-row gap-4 items-center" >
                                                    <img :src="file?.objectURL" alt="picture" >
                                                    {{ file.rawFilename }}
                                                    <Badge :value="file.uploadStatus" severity="secondary"></Badge>
                                                </li>
                                            </ul>
                                        </template>
                                    </FileUpload>
                                </div>

                                <div class="col-span-1" >
                                    
                                    <Editor v-model="activeDocumentContent" editorStyle="height: 320px" />

                                </div>
                            </StepPanel>
                        </StepItem>
                        <StepItem value="2">
                            <Step>Header II</Step>
                            <StepPanel v-slot="{ activateCallback }">
                                <div class="flex flex-col h-48">
                                    <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content II</div>
                                </div>
                                <div class="flex py-6 gap-2">
                                    <Button label="Back" severity="secondary" @click="activateCallback('1')" />
                                    <Button label="Next" @click="activateCallback('3')" />
                                </div>
                            </StepPanel>
                        </StepItem>
                        <StepItem value="3">
                            <Step>Header III</Step>
                            <StepPanel v-slot="{ activateCallback }">
                                <div class="flex flex-col h-48">
                                    <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                                </div>
                                <div class="py-6">
                                    <Button label="Back" severity="secondary" @click="activateCallback('2')" />
                                </div>
                            </StepPanel>
                        </StepItem>
                    </Stepper>
                </div>

                <footer class="h-20 w-full bg-white-500 shadow-lg flex items-center px-8 mt-auto" >
                    <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
                </footer>

            </div>

            <!-- PANEL -->
            <div class="shadow-lg h-full" >
                <Accordion value="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus" >
                    <AccordionPanel value="0">
                        <AccordionHeader>
                            <span class="flex items-center gap-2 w-full">
                                <i class="pi pi-hammer" style="color: slateblue"></i>
                                <span class="font-bold whitespace-nowrap">Outils</span> 
                                <Badge :value="toolsCount" class="ml-auto mr-2" />
                            </span>
                        </AccordionHeader>
                        <AccordionContent>
                            <InputText type="text" v-model="toolName" placeholder="Nom de l'outil" @keydown.enter="handleAddTool" />
                            <ul v-if="activeDocumentation" class="flex flex-col gap-2 mt-2" >
                                <li v-for="(tool,index) in activeDocumentation?.getTools()" :key="index" >
                                    {{ tool.getName() }}
                                    <Button icon="pi pi-trash" @click="activeDocumentation?.removeTool(tool.getName())" />
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader>
                            <span class="flex items-center gap-2 w-full">
                                <i class="pi pi-images" style="color: slateblue"></i>
                                <span class="font-bold whitespace-nowrap">Images</span> 
                                <Badge :value="activeDocumentation?.getPictures().length ?? 0" class="ml-auto mr-2" />
                            </span>
                        </AccordionHeader>
                        <AccordionContent>
                            <ul v-if="activeDocumentation" class="flex flex-col gap-2 mt-2" >
                                <li v-for="(picture,index) in activeDocumentation?.getPictures()" :key="index" class="flex flex-row gap-2 items-center" >
                                    <img :src="picture.getObjectURL()" alt="picture" />
                                    <Button icon="pi pi-trash" @click="activeDocumentation?.removePicture(picture.getRawFilename())" />
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="2">
                        <AccordionHeader>
                            <span class="flex items-center gap-2 w-full">
                                <i class="pi pi-sort-numeric-down-alt" style="color: slateblue"></i>
                                <span class="font-bold whitespace-nowrap">Etapes</span> 
                                <Badge :value="panelMenuItems.length" class="ml-auto mr-2" />
                            </span>
                        </AccordionHeader>
                        <AccordionContent>
                            <Button label="Ajouter une documentation" @click="addNewDocumentation"  />
                            <ul v-if="activeDocumentation" >
                                <li v-for="(document,index) in panelMenuItems" :key="index" @click="activeDocumentID = document.label   " >
                                    <p><span class="font-bold" >{{ document.order + 1 }}.</span>{{ document.label }}</p>
                                    <Button icon="pi pi-trash" @click="activeDocumentation?.removeDocument(document.label)" />
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </div>

        </main>

    </div>
</template>

<script setup lang="ts">
import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation';
import { useToast } from 'primevue/usetoast';
import { DocumentationVersion0001 } from '~/schemas/documentation/Documentation';

const toast = useToast();

const activeDocumentID = ref();

const toolsCount = computed(()=> (activeDocumentation.value?.getTools() ?? []).length );

const documentations = ref<AbstractDocumentation[]>([]);

const activeDocumentation = computed(()=> documentations.value.find( doc => doc.getID() === activeDocumentID.value ) );

const computeUploadedPicturesStatus = ( files: File[] ) => {

    const pictures = activeDocumentation.value?.getPictures();

    return pictures?.map( picture => {

        const pictureIsUploaded = files?.find( file => picture.getRawFilename() === file.name );

        return {
            rawFilename: picture.getRawFilename(),
            objectURL: picture.getObjectURL(),
            uploadStatus: pictureIsUploaded ? "Succès" : "Pas Upload"
        }

    })

}

const panelMenuItems = computed(()=>{
    return documentations.value.map( (doc, index) => {
        return {
            label: doc.getID(),
            order: index,
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

onMounted(() => {

    (async()=>{
        const documentation = new DocumentationVersion0001();

        const [ error, documentID ] = await documentation.new()

        documentations.value.push(documentation);

        activeDocumentID.value = documentID;
    })();

});

</script>