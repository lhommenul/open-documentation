<template>
    <div class="h-screen w-screen flex flex-col">

        <!-- HEADER -->
        <header class="bg-white shadow-lg h-16 flex items-center justify-between px-8">
            <div class="flex items-center gap-4 flex-1">
                <i class="pi pi-book text-2xl text-blue-600"></i>
                <div class="flex-1 max-w-2xl">
                    <input
                        v-if="editingGlobalTitle"
                        v-model="globalTitle"
                        @blur="editingGlobalTitle = false"
                        @keydown.enter="editingGlobalTitle = false"
                        class="text-2xl font-bold border-b-2 border-blue-500 outline-none w-full"
                        placeholder="Titre de la documentation globale"
                        autofocus
                    />
                    <h1 
                        v-else
                        @click="editingGlobalTitle = true"
                        class="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
                    >
                        {{ globalTitle || 'Cliquez pour ajouter un titre' }}
                        <i class="pi pi-pencil text-sm ml-2 text-gray-400"></i>
                    </h1>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <Button 
                    label="Nouvelle étape" 
                    icon="pi pi-plus" 
                    @click="addNewDocumentation"
                    size="small"
                />
                <Button 
                    label="Exporter" 
                    icon="pi pi-download" 
                    severity="secondary"
                    size="small"
                />
            </div>
        </header>

        <div class="flex-1 flex overflow-hidden">

            <!-- SIDEBAR GAUCHE - Liste des documentations/étapes -->
            <aside class="w-80 bg-white shadow-lg overflow-y-auto border-r">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold flex items-center gap-2">
                            <i class="pi pi-list"></i>
                            Étapes
                        </h2>
                        <Badge :value="sortedDocumentations.length" severity="info" />
                    </div>
                    
                    <ScrollPanel style="width: 100%; height: calc(100vh - 200px)">
                        <div class="flex flex-col gap-2">
                            <div 
                                v-for="(doc, index) in sortedDocumentations" 
                                :key="doc.id"
                                :draggable="true"
                                @dragstart="handleDragStart($event, index)"
                                @dragend="handleDragEnd"
                                @dragover.prevent="handleDragOver($event, index)"
                                @drop="handleDrop($event, index)"
                                @click="activeDocumentID = doc.id"
                                class="p-4 rounded-lg cursor-pointer transition-all hover:bg-blue-50 border-2 group"
                                :class="{
                                    'bg-blue-100 border-blue-500': activeDocumentID === doc.id,
                                    'border-transparent': activeDocumentID !== doc.id,
                                    'opacity-50': draggedIndex === index,
                                    'border-t-4 border-t-blue-500': dragOverIndex === index
                                }"
                            >
                                <div class="flex items-start gap-3">
                                    <!-- Drag Handle -->
                                    <div class="cursor-move mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                        <i class="pi pi-bars text-gray-400"></i>
                                    </div>
                                    
                                    <!-- Order Badge -->
                                    <div class="flex-shrink-0">
                                        <Badge :value="doc.order + 1" class="text-base" />
                                    </div>
                                    
                                    <!-- Content -->
                                    <div class="flex-1 min-w-0">
                                        <input
                                            v-if="editingDocId === doc.id"
                                            v-model="doc.title"
                                            @blur="editingDocId = null"
                                            @keydown.enter="editingDocId = null"
                                            @click.stop
                                            class="font-semibold text-base border-b border-blue-500 outline-none w-full bg-transparent"
                                            placeholder="Titre de l'étape"
                                            autofocus
                                        />
                                        <div 
                                            v-else
                                            @click.stop="editingDocId = doc.id"
                                            class="font-semibold text-base hover:text-blue-600 truncate"
                                        >
                                            {{ doc.title || `Étape ${doc.order + 1}` }}
                                            <i class="pi pi-pencil text-xs ml-2 text-gray-400 opacity-0 group-hover:opacity-100"></i>
                                        </div>
                                        
                                        <div class="flex gap-3 mt-2 text-xs text-gray-600">
                                            <span class="flex items-center gap-1">
                                                <i class="pi pi-hammer"></i> 
                                                {{ doc.documentation.getTools().length }}
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <i class="pi pi-images"></i> 
                                                {{ doc.documentation.getPictures().length }}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <!-- Delete Button -->
                                    <Button 
                                        icon="pi pi-trash" 
                                        @click.stop="removeDocumentation(doc.id)"
                                        text
                                        rounded
                                        severity="danger"
                                        size="small"
                                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollPanel>
                </div>
            </aside>

            <!-- CONTENU PRINCIPAL -->
            <main class="flex-1 overflow-y-auto bg-gray-50">
                
                <div v-if="!activeDocumentation" class="h-full flex items-center justify-center">
                    <div class="text-center">
                        <i class="pi pi-file text-6xl text-gray-300 mb-4"></i>
                        <p class="text-xl text-gray-500 mb-4">Aucune étape sélectionnée</p>
                        <Button 
                            label="Créer une première étape" 
                            icon="pi pi-plus" 
                            @click="addNewDocumentation"
                        />
                    </div>
                </div>

                <div v-else class="p-8">
                    
                    <!-- En-tête de l'étape -->
                    <div class="mb-6 bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center gap-4 flex-1">
                                <Badge :value="`Étape ${activeDocInfo.order + 1}`" severity="info" class="text-lg px-4 py-2" />
                                <div class="flex-1">
                                    <input
                                        v-if="editingActiveTitle"
                                        v-model="activeDocInfo.title"
                                        @blur="editingActiveTitle = false"
                                        @keydown.enter="editingActiveTitle = false"
                                        class="text-3xl font-bold border-b-2 border-blue-500 outline-none w-full"
                                        placeholder="Titre de l'étape"
                                        autofocus
                                    />
                                    <h2 
                                        v-else
                                        @click="editingActiveTitle = true"
                                        class="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                    >
                                        {{ activeDocInfo.title || `Étape ${activeDocInfo.order + 1}` }}
                                        <i class="pi pi-pencil text-lg ml-2 text-gray-400"></i>
                                    </h2>
                                </div>
                            </div>
                            
                            <!-- Navigation entre étapes -->
                            <div class="flex gap-2">
                                <Button 
                                    icon="pi pi-chevron-left" 
                                    @click="goToPreviousStep"
                                    :disabled="!hasPreviousStep"
                                    severity="secondary"
                                    text
                                    rounded
                                    v-tooltip.bottom="'Étape précédente'"
                                />
                                <Button 
                                    icon="pi pi-chevron-right" 
                                    @click="goToNextStep"
                                    :disabled="!hasNextStep"
                                    severity="secondary"
                                    text
                                    rounded
                                    v-tooltip.bottom="'Étape suivante'"
                                />
                            </div>
                        </div>
                        
                        <p class="text-sm text-gray-500">
                            ID: {{ activeDocumentation.getID() }}
                        </p>
                    </div>

                    <!-- Tabs pour organiser le contenu -->
                    <div class="bg-white rounded-lg shadow-sm">
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
                                    <div class="p-6">
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
                                    <div class="p-6">
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
                                    <div class="p-6">
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

// Titre global
const globalTitle = ref<string>('Réparation du moteur de Peugeot 208');
const editingGlobalTitle = ref(false);

// Gestion des documentations
interface DocumentationItem {
    id: string;
    title: string;
    order: number;
    documentation: AbstractDocumentation;
}

const documentations = ref<DocumentationItem[]>([]);
const activeDocumentID = ref<string | null>(null);
const editingDocId = ref<string | null>(null);
const editingActiveTitle = ref(false);
const toolName = ref<string>('');

// Drag and Drop state
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Computed
const sortedDocumentations = computed(() => 
    [...documentations.value].sort((a, b) => a.order - b.order)
);

const activeDocInfo = computed(() => 
    documentations.value.find(doc => doc.id === activeDocumentID.value)
);

const activeDocumentation = computed(() => 
    activeDocInfo.value?.documentation
);

const activeDocumentContent = computed({
    get: () => activeDocumentation.value?.getContent() ?? '',
    set: (content: string) => {
        activeDocumentation.value?.setContent(content);
    }
});

const hasPreviousStep = computed(() => {
    if (!activeDocInfo.value) return false;
    return activeDocInfo.value.order > 0;
});

const hasNextStep = computed(() => {
    if (!activeDocInfo.value) return false;
    return activeDocInfo.value.order < documentations.value.length - 1;
});

// Drag and Drop Methods
const handleDragStart = (event: DragEvent, index: number) => {
    draggedIndex.value = index;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
    }
};

const handleDragEnd = () => {
    draggedIndex.value = null;
    dragOverIndex.value = null;
};

const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    dragOverIndex.value = index;
};

const handleDrop = (event: DragEvent, dropIndex: number) => {
    event.preventDefault();
    
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
        draggedIndex.value = null;
        dragOverIndex.value = null;
        return;
    }

    const sorted = sortedDocumentations.value;
    const draggedItem = sorted[draggedIndex.value];
    
    // Créer une nouvelle copie du tableau
    const newDocs = [...sorted];
    
    // Retirer l'élément déplacé
    newDocs.splice(draggedIndex.value, 1);
    
    // L'insérer à la nouvelle position
    newDocs.splice(dropIndex, 0, draggedItem);
    
    // Mettre à jour les ordres
    newDocs.forEach((doc, idx) => {
        doc.order = idx;
    });
    
    // Mettre à jour la liste
    documentations.value = newDocs;
    
    draggedIndex.value = null;
    dragOverIndex.value = null;
    
    toast.add({
        severity: 'success',
        summary: 'Ordre mis à jour',
        detail: 'L\'ordre des étapes a été modifié',
        life: 2000
    });
};

// Navigation Methods
const goToPreviousStep = () => {
    if (!hasPreviousStep.value || !activeDocInfo.value) return;
    const previousDoc = sortedDocumentations.value.find(
        doc => doc.order === activeDocInfo.value!.order - 1
    );
    if (previousDoc) {
        activeDocumentID.value = previousDoc.id;
    }
};

const goToNextStep = () => {
    if (!hasNextStep.value || !activeDocInfo.value) return;
    const nextDoc = sortedDocumentations.value.find(
        doc => doc.order === activeDocInfo.value!.order + 1
    );
    if (nextDoc) {
        activeDocumentID.value = nextDoc.id;
    }
};

// Tool Methods
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

// Image Methods
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
            detail: 'Aucune étape active',
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

// Documentation Methods
const addNewDocumentation = async () => {
    const documentation = new DocumentationVersion0001();
    const [error, documentID] = await documentation.new();

    if (error || !documentID) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer l\'étape',
            life: 3000
        });
        return;
    }

    const newDoc: DocumentationItem = {
        id: documentID,
        title: `Étape ${documentations.value.length + 1}`,
        order: documentations.value.length,
        documentation
    };

    documentations.value.push(newDoc);
    activeDocumentID.value = documentID;
    
    toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Nouvelle étape créée',
        life: 2000
    });
};

const removeDocumentation = (docId: string) => {
    const index = documentations.value.findIndex(doc => doc.id === docId);
    if (index > -1) {
        documentations.value.splice(index, 1);
        
        // Réorganiser les ordres
        documentations.value.forEach((doc, idx) => {
            doc.order = idx;
        });
        
        if (activeDocumentID.value === docId) {
            activeDocumentID.value = documentations.value[0]?.id ?? null;
        }
        
        toast.add({
            severity: 'info',
            summary: 'Supprimé',
            detail: 'Étape supprimée',
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

// Lifecycle
onMounted(async () => {
    const documentation = new DocumentationVersion0001();
    const [error, documentID] = await documentation.new();

    if (!error && documentID) {
        const newDoc: DocumentationItem = {
            id: documentID,
            title: 'Vérification du moteur',
            order: 0,
            documentation
        };
        
        documentations.value.push(newDoc);
        activeDocumentID.value = documentID;
    }
});

</script>

<style scoped>
input {
    transition: all 0.2s;
}

[draggable="true"] {
    cursor: move;
}

[draggable="true"]:active {
    cursor: grabbing;
}
</style>
