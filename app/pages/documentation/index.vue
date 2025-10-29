<template>
    <div class="h-screen w-screen flex flex-col">

        <!-- HEADER -->
        <header class="bg-white shadow-lg h-16 flex items-center justify-between px-8">
            <h1 class="text-2xl font-bold">Documentation</h1>
            <div class="flex items-center gap-4">
                <Button 
                    label="Nouvelle documentation" 
                    icon="pi pi-plus" 
                    @click="addNewDocumentation"
                    size="small"
                />
            </div>
        </header>

        <div class="flex-1 flex overflow-hidden">

            <!-- SIDEBAR GAUCHE - Liste des documentations -->
            <aside class="w-64 bg-white shadow-lg overflow-y-auto">
                <div class="p-4">
                    <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        Mes Documentations
                        <Badge :value="documentations.length" severity="info" class="ml-auto" />
                    </h2>
                    
                    <ScrollPanel style="width: 100%; height: calc(100vh - 200px)">
                        <ul class="flex flex-col gap-2">
                            <li 
                                v-for="(doc, index) in documentations" 
                                :key="doc.getID()"
                                @click="activeDocumentID = doc.getID()"
                                class="p-3 rounded-lg cursor-pointer transition-all hover:bg-blue-50 border-2"
                                :class="{
                                    'bg-blue-100 border-blue-500': activeDocumentID === doc.getID(),
                                    'border-transparent': activeDocumentID !== doc.getID()
                                }"
                            >
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <span class="font-bold text-gray-500">{{ index + 1 }}.</span>
                                        <span class="font-medium">{{ doc.getID().substring(0, 20) }}...</span>
                                    </div>
                                    <Button 
                                        icon="pi pi-trash" 
                                        @click.stop="removeDocumentation(doc.getID())"
                                        text
                                        rounded
                                        severity="danger"
                                        size="small"
                                    />
                                </div>
                                <div class="flex gap-2 mt-2 text-xs text-gray-600">
                                    <span><i class="pi pi-hammer"></i> {{ doc.getTools().length }}</span>
                                    <span><i class="pi pi-images"></i> {{ doc.getPictures().length }}</span>
                                </div>
                            </li>
                        </ul>
                    </ScrollPanel>
                </div>
            </aside>

            <!-- CONTENU PRINCIPAL -->
            <main class="flex-1 overflow-y-auto p-8">
                
                <div v-if="!activeDocumentation" class="h-full flex items-center justify-center">
                    <div class="text-center">
                        <i class="pi pi-file text-6xl text-gray-300 mb-4"></i>
                        <p class="text-xl text-gray-500 mb-4">Aucune documentation sélectionnée</p>
                        <Button 
                            label="Créer une documentation" 
                            icon="pi pi-plus" 
                            @click="addNewDocumentation"
                        />
                    </div>
                </div>

                <div v-else class="max-w-5xl mx-auto">
                    
                    <!-- Titre de la documentation -->
                    <div class="mb-6">
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">Documentation</h2>
                        <p class="text-sm text-gray-500">ID: {{ activeDocumentation.getID() }}</p>
                    </div>

                    <!-- Tabs pour organiser le contenu -->
                    <Tabs value="0">
                        <TabList>
                            <Tab value="0">
                                <i class="pi pi-pencil mr-2"></i>
                                Contenu
                            </Tab>
                            <Tab value="1">
                                <i class="pi pi-images mr-2"></i>
                                Images ({{ activeDocumentation.getPictures().length }})
                            </Tab>
                            <Tab value="2">
                                <i class="pi pi-hammer mr-2"></i>
                                Outils ({{ activeDocumentation.getTools().length }})
                            </Tab>
                        </TabList>
                        
                        <TabPanels>
                            <!-- TAB CONTENU -->
                            <TabPanel value="0">
                                <div class="mt-6">
                                    <Editor 
                                        v-model="activeDocumentContent" 
                                        editorStyle="height: 500px" 
                                    />
                                    <div class="mt-4 flex justify-end gap-2">
                                        <Button 
                                            label="Enregistrer" 
                                            icon="pi pi-save" 
                                            @click="saveDocumentation"
                                        />
                                    </div>
                                </div>
                            </TabPanel>

                            <!-- TAB IMAGES -->
                            <TabPanel value="1">
                                <div class="mt-6">
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
                                            <div v-if="activeDocumentation.getPictures().length > 0" class="grid grid-cols-3 gap-4 mt-4">
                                                <div 
                                                    v-for="picture in activeDocumentation.getPictures()" 
                                                    :key="picture.getRawFilename()"
                                                    class="relative border rounded-lg overflow-hidden group"
                                                >
                                                    <img 
                                                        :src="picture.getObjectURL()" 
                                                        alt="picture" 
                                                        class="w-full h-48 object-cover"
                                                    >
                                                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Button 
                                                            icon="pi pi-trash" 
                                                            @click="activeDocumentation?.removePicture(picture.getRawFilename())"
                                                            severity="danger"
                                                            rounded
                                                        />
                                                    </div>
                                                    <div class="p-2 bg-gray-100">
                                                        <p class="text-xs truncate">{{ picture.getRawFilename() }}</p>
                                                        <Badge 
                                                            :value="files?.find(f => f.name === picture.getRawFilename()) ? 'Uploadé' : 'En attente'" 
                                                            :severity="files?.find(f => f.name === picture.getRawFilename()) ? 'success' : 'warning'"
                                                            class="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else class="text-center py-12 text-gray-500">
                                                <i class="pi pi-images text-5xl mb-4"></i>
                                                <p>Aucune image ajoutée</p>
                                            </div>
                                        </template>
                                    </FileUpload>
                                </div>
                            </TabPanel>

                            <!-- TAB OUTILS -->
                            <TabPanel value="2">
                                <div class="mt-6">
                                    <div class="flex gap-2 mb-4">
                                        <InputText 
                                            type="text" 
                                            v-model="toolName" 
                                            placeholder="Nom de l'outil" 
                                            @keydown.enter="handleAddTool"
                                            class="flex-1"
                                        />
                                        <Button 
                                            label="Ajouter" 
                                            icon="pi pi-plus" 
                                            @click="handleAddTool"
                                        />
                                    </div>

                                    <div v-if="activeDocumentation.getTools().length > 0" class="space-y-2">
                                        <div 
                                            v-for="(tool, index) in activeDocumentation.getTools()" 
                                            :key="index"
                                            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                        >
                                            <div class="flex items-center gap-3">
                                                <span class="font-bold text-gray-500">{{ index + 1 }}.</span>
                                                <i class="pi pi-hammer text-blue-500"></i>
                                                <span class="font-medium">{{ tool.getName() }}</span>
                                            </div>
                                            <Button 
                                                icon="pi pi-trash" 
                                                @click="activeDocumentation?.removeTool(tool.getName())"
                                                text
                                                rounded
                                                severity="danger"
                                            />
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-12 text-gray-500">
                                        <i class="pi pi-hammer text-5xl mb-4"></i>
                                        <p>Aucun outil ajouté</p>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </div>

            </main>

        </div>

    </div>
</template>

<script setup lang="ts">
import type { AbstractDocumentation } from '~/schemas/documentation/types/AbstractDocumentation';
import { useToast } from 'primevue/usetoast';
import { DocumentationVersion0001 } from '~/schemas/documentation/Documentation';

const toast = useToast();

const activeDocumentID = ref();
const toolName = ref<string>('');
const documentations = ref<AbstractDocumentation[]>([]);

const activeDocumentation = computed(() => 
    documentations.value.find(doc => doc.getID() === activeDocumentID.value)
);

const activeDocumentContent = computed({
    get: () => activeDocumentation.value?.getContent() ?? '',
    set: (content: string) => {
        activeDocumentation.value?.setContent(content);
    }
});

const handleAddTool = () => {
    if (!toolName.value.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Veuillez entrer un nom d\'outil',
            life: 3000
        });
        return;
    }

    activeDocumentation.value?.addTool(toolName.value);
    toolName.value = '';
    
    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Outil ajouté',
        life: 2000
    });
};

const onUpload = async (event: any) => {
    const file = event.files[0];

    if (!file) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Fichier non trouvé',
            life: 3000
        });
        return;
    }

    if (!activeDocumentation.value) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Aucun document actif',
            life: 3000
        });
        return;
    }

    const [error] = await activeDocumentation.value?.addPicture(file);

    if (error) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.message,
            life: 3000
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Image ajoutée avec succès',
        life: 3000
    });
};

const addNewDocumentation = async () => {
    const documentation = new DocumentationVersion0001();
    const [error, documentID] = await documentation.new();

    if (error) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la documentation',
            life: 3000
        });
        return;
    }

    documentations.value.push(documentation);
    activeDocumentID.value = documentID;
    
    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Documentation créée',
        life: 2000
    });
};

const removeDocumentation = (docId: string) => {
    const index = documentations.value.findIndex(doc => doc.getID() === docId);
    if (index > -1) {
        documentations.value.splice(index, 1);
        if (activeDocumentID.value === docId) {
            activeDocumentID.value = documentations.value[0]?.getID() ?? null;
        }
        toast.add({
            severity: 'info',
            summary: 'Supprimé',
            detail: 'Documentation supprimée',
            life: 2000
        });
    }
};

const saveDocumentation = () => {
    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Documentation enregistrée',
        life: 2000
    });
};

onMounted(async () => {
    const documentation = new DocumentationVersion0001();
    const [error, documentID] = await documentation.new();

    if (!error) {
        documentations.value.push(documentation);
        activeDocumentID.value = documentID;
    }
});

</script>
