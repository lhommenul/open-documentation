<template>
    <div class="h-screen w-screen flex flex-col bg-gray-50">
        
        <!-- HEADER -->
        <header class="bg-white shadow-md h-16 flex items-center justify-between px-8 sticky top-0 z-50">
            <div class="flex items-center gap-4">
                <Button 
                    icon="pi pi-arrow-left" 
                    text
                    rounded
                    @click="navigateTo('/documentation/list')"
                    v-tooltip.bottom="'Retour à la liste'"
                />
                <i class="pi pi-book text-2xl text-blue-600"></i>
                <h1 class="text-2xl font-bold text-gray-800">
                    {{ globalTitle || 'Documentation' }}
                </h1>
            </div>
            
            <div class="flex items-center gap-3">
                <!-- Bouton Favori -->
                <Button 
                    :icon="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                    :severity="isFavorite ? 'danger' : 'secondary'"
                    @click="toggleFavorite"
                    outlined
                    v-tooltip.bottom="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                />
                
                <!-- Bouton Notes -->
                <Button 
                    icon="pi pi-bookmark" 
                    :badge="String(userNotes.length)"
                    :badgeClass="userNotes.length > 0 ? 'bg-blue-500' : ''"
                    @click="showNotesPanel = !showNotesPanel"
                    outlined
                    severity="info"
                    v-tooltip.bottom="'Mes notes'"
                />
                
                <!-- Bouton Commentaires -->
                <Button 
                    icon="pi pi-comments" 
                    :badge="String(allComments.length)"
                    :badgeClass="allComments.length > 0 ? 'bg-green-500' : ''"
                    @click="showCommentsPanel = !showCommentsPanel"
                    outlined
                    severity="success"
                    v-tooltip.bottom="'Commentaires'"
                />

                <!-- Bouton Mode édition -->
                <Button 
                    label="Mode édition" 
                    icon="pi pi-pencil" 
                    @click="navigateTo(`/documentation/${documentationId}`)"
                    severity="secondary"
                />
            </div>
        </header>

        <!-- BARRE DES BRANDS -->
        <div v-if="globalBrands.length > 0" class="bg-blue-50 border-b border-blue-200 px-8 py-3">
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i class="pi pi-tag text-blue-600"></i>
                    Marques :
                </span>
                <Chip 
                    v-for="(brand, index) in globalBrands" 
                    :key="index"
                    :label="brand"
                    class="bg-blue-600 text-white"
                />
            </div>
        </div>

        <div v-if="isLoading" class="flex-1 flex items-center justify-center">
            <div class="text-center">
                <i class="pi pi-spin pi-spinner text-6xl text-blue-500 mb-4"></i>
                <p class="text-xl text-gray-600">Chargement de la documentation...</p>
            </div>
        </div>

        <div v-else-if="loadError" class="flex-1 flex items-center justify-center">
            <div class="text-center">
                <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
                <p class="text-xl text-gray-600 mb-4">{{ loadError }}</p>
                <Button 
                    label="Retour à la liste" 
                    icon="pi pi-arrow-left" 
                    @click="navigateTo('/documentation/list')"
                />
            </div>
        </div>

        <div v-else class="flex-1 flex overflow-hidden">
            
            <!-- SIDEBAR GAUCHE - Navigation des étapes -->
            <aside class="w-80 bg-white shadow-lg overflow-y-auto border-r">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold flex items-center gap-2">
                            <i class="pi pi-list"></i>
                            Étapes
                        </h2>
                        <Badge :value="documentationSteps.length" severity="info" />
                    </div>
                    
                    <div class="flex flex-col gap-2">
                        <div 
                            v-for="(step, index) in documentationSteps" 
                            :key="step.id"
                            @click="activeStepId = step.id"
                            class="p-4 rounded-lg cursor-pointer transition-all hover:bg-blue-50 border-2"
                            :class="{
                                'bg-blue-100 border-blue-500': activeStepId === step.id,
                                'border-transparent': activeStepId !== step.id
                            }"
                        >
                            <div class="flex items-start gap-3">
                                <Badge :value="index + 1" class="text-base" />
                                <div class="flex-1">
                                    <h3 class="font-semibold text-base">
                                        {{ step.title || `Étape ${index + 1}` }}
                                    </h3>
                                    <div class="flex gap-3 mt-2 text-xs text-gray-600">
                                        <span class="flex items-center gap-1">
                                            <i class="pi pi-hammer"></i> 
                                            {{ step.tools.length }}
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <i class="pi pi-images"></i> 
                                            {{ step.pictures.length }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- CONTENU PRINCIPAL -->
            <main class="flex-1 overflow-y-auto p-8">
                <div v-if="!activeStep" class="h-full flex items-center justify-center">
                    <div class="text-center">
                        <i class="pi pi-file text-6xl text-gray-300 mb-4"></i>
                        <p class="text-xl text-gray-500">Sélectionnez une étape pour commencer</p>
                    </div>
                </div>

                <div v-else class="max-w-4xl mx-auto">
                    <!-- En-tête de l'étape -->
                    <div class="mb-6 bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-4">
                                <Badge :value="`Étape ${activeStepIndex + 1}`" severity="info" class="text-lg px-4 py-2" />
                                <h2 class="text-3xl font-bold text-gray-800">
                                    {{ activeStep.title || `Étape ${activeStepIndex + 1}` }}
                                </h2>
                            </div>
                            
                            <!-- Navigation entre étapes -->
                            <div class="flex gap-2">
                                <Button 
                                    icon="pi pi-chevron-left" 
                                    @click="goToPreviousStep"
                                    :disabled="activeStepIndex === 0"
                                    severity="secondary"
                                    text
                                    rounded
                                    v-tooltip.bottom="'Étape précédente'"
                                />
                                <Button 
                                    icon="pi pi-chevron-right" 
                                    @click="goToNextStep"
                                    :disabled="activeStepIndex === documentationSteps.length - 1"
                                    severity="secondary"
                                    text
                                    rounded
                                    v-tooltip.bottom="'Étape suivante'"
                                />
                            </div>
                        </div>

                        <!-- Bouton Ajouter une note pour cette étape -->
                        <Button 
                            label="Ajouter une note" 
                            icon="pi pi-plus" 
                            @click="openAddNoteDialog(activeStep.id)"
                            size="small"
                            outlined
                        />
                    </div>

                    <!-- Contenu de l'étape -->
                    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <i class="pi pi-file-edit text-blue-600"></i>
                            Contenu
                        </h3>
                        <div 
                            v-html="activeStep.content || '<p class=\'text-gray-400 italic\'>Aucun contenu disponible</p>'" 
                            class="prose max-w-none"
                        ></div>
                    </div>

                    <!-- Images -->
                    <div v-if="activeStep.pictures.length > 0" class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <i class="pi pi-images text-blue-600"></i>
                            Images ({{ activeStep.pictures.length }})
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div 
                                v-for="(picture, index) in activeStep.pictures" 
                                :key="index"
                                class="relative border rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                                @click="openImagePreview(picture, index)"
                            >
                                <img 
                                    :src="picture.url || `/uploads/${picture.filename}`" 
                                    :alt="`Image ${index + 1}`" 
                                    class="w-full h-48 object-cover"
                                >
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <i class="pi pi-eye text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Outils requis -->
                    <div v-if="activeStep.tools.length > 0" class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <i class="pi pi-hammer text-blue-600"></i>
                            Outils requis ({{ activeStep.tools.length }})
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div 
                                v-for="(tool, index) in activeStep.tools" 
                                :key="index"
                                class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                            >
                                <i class="pi pi-hammer text-blue-500"></i>
                                <span class="font-medium">{{ tool.name }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Mes notes pour cette étape -->
                    <div v-if="stepNotes.length > 0" class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <i class="pi pi-bookmark text-blue-600"></i>
                            Mes notes pour cette étape
                        </h3>
                        <div class="space-y-3">
                            <div 
                                v-for="note in stepNotes" 
                                :key="note._id"
                                class="p-4 rounded-lg border-l-4 hover:shadow-md transition-shadow"
                                :class="`border-${note.color}-500 bg-${note.color}-50`"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs text-gray-500">
                                        {{ formatDate(note.createdAt) }}
                                    </span>
                                    <div class="flex gap-2">
                                        <Button 
                                            icon="pi pi-pencil" 
                                            @click="editNote(note)"
                                            text
                                            rounded
                                            size="small"
                                        />
                                        <Button 
                                            icon="pi pi-trash" 
                                            @click="deleteNote(note._id)"
                                            text
                                            rounded
                                            severity="danger"
                                            size="small"
                                        />
                                    </div>
                                </div>
                                <p class="text-gray-800">{{ note.content }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Commentaires pour cette étape -->
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
                            <i class="pi pi-comments text-blue-600"></i>
                            Commentaires ({{ stepComments.length }})
                        </h3>
                        
                        <!-- Formulaire d'ajout de commentaire -->
                        <div class="mb-6">
                            <Textarea 
                                v-model="newCommentContent"
                                placeholder="Ajouter un commentaire..."
                                rows="3"
                                class="w-full"
                            />
                            <div class="mt-2 flex justify-end">
                                <Button 
                                    label="Publier" 
                                    icon="pi pi-send" 
                                    @click="addComment"
                                    :disabled="!newCommentContent.trim()"
                                />
                            </div>
                        </div>

                        <!-- Liste des commentaires -->
                        <div class="space-y-4">
                            <div 
                                v-for="comment in stepComments" 
                                :key="comment._id"
                                class="border rounded-lg p-4 hover:bg-gray-50"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <span class="font-semibold text-gray-800">{{ comment.userName }}</span>
                                        <span class="text-xs text-gray-500 ml-2">
                                            {{ formatDate(comment.createdAt) }}
                                        </span>
                                    </div>
                                    <div class="flex gap-2">
                                        <Button 
                                            :icon="'pi pi-heart'" 
                                            :label="String(comment.likes)"
                                            @click="likeComment(comment._id)"
                                            text
                                            size="small"
                                        />
                                        <Button 
                                            v-if="comment.userId === currentUserId"
                                            icon="pi pi-trash" 
                                            @click="deleteComment(comment._id)"
                                            text
                                            severity="danger"
                                            size="small"
                                        />
                                    </div>
                                </div>
                                <p class="text-gray-700">{{ comment.content }}</p>
                            </div>
                            
                            <div v-if="stepComments.length === 0" class="text-center py-8 text-gray-400">
                                <i class="pi pi-comments text-4xl mb-2"></i>
                                <p>Aucun commentaire pour le moment</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <!-- SIDEBAR DROITE - Panel de notes/commentaires -->
            <Transition name="slide-left">
                <aside v-if="showNotesPanel || showCommentsPanel" class="w-96 bg-white shadow-lg overflow-y-auto border-l">
                    
                    <!-- Panel Notes -->
                    <div v-if="showNotesPanel" class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-semibold flex items-center gap-2">
                                <i class="pi pi-bookmark text-blue-600"></i>
                                Mes notes
                            </h2>
                            <Button 
                                icon="pi pi-times" 
                                @click="showNotesPanel = false"
                                text
                                rounded
                            />
                        </div>

                        <Button 
                            label="Nouvelle note" 
                            icon="pi pi-plus" 
                            @click="openAddNoteDialog()"
                            class="w-full mb-4"
                            outlined
                        />

                        <div v-if="userNotes.length === 0" class="text-center py-12 text-gray-400">
                            <i class="pi pi-bookmark text-5xl mb-4"></i>
                            <p>Aucune note</p>
                        </div>

                        <div v-else class="space-y-3">
                            <div 
                                v-for="note in userNotes" 
                                :key="note._id"
                                class="p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                                :class="`border-${note.color}-500 bg-${note.color}-50`"
                                @click="scrollToStep(note.stepId)"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <span class="text-xs font-semibold text-gray-600">
                                        {{ getStepTitle(note.stepId) }}
                                    </span>
                                    <div class="flex gap-1">
                                        <Button 
                                            icon="pi pi-pencil" 
                                            @click.stop="editNote(note)"
                                            text
                                            rounded
                                            size="small"
                                        />
                                        <Button 
                                            icon="pi pi-trash" 
                                            @click.stop="deleteNote(note._id)"
                                            text
                                            rounded
                                            severity="danger"
                                            size="small"
                                        />
                                    </div>
                                </div>
                                <p class="text-sm text-gray-800">{{ note.content }}</p>
                                <span class="text-xs text-gray-500 mt-1 block">
                                    {{ formatDate(note.createdAt) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Panel Commentaires -->
                    <div v-if="showCommentsPanel" class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-semibold flex items-center gap-2">
                                <i class="pi pi-comments text-green-600"></i>
                                Tous les commentaires
                            </h2>
                            <Button 
                                icon="pi pi-times" 
                                @click="showCommentsPanel = false"
                                text
                                rounded
                            />
                        </div>

                        <div v-if="allComments.length === 0" class="text-center py-12 text-gray-400">
                            <i class="pi pi-comments text-5xl mb-4"></i>
                            <p>Aucun commentaire</p>
                        </div>

                        <div v-else class="space-y-3">
                            <div 
                                v-for="comment in allComments" 
                                :key="comment._id"
                                class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                @click="scrollToStep(comment.stepId)"
                            >
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <span class="font-semibold text-sm">{{ comment.userName }}</span>
                                        <span class="text-xs text-gray-500 block">
                                            {{ getStepTitle(comment.stepId) }}
                                        </span>
                                    </div>
                                    <span class="text-xs text-gray-500">
                                        {{ formatDate(comment.createdAt) }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-700">{{ comment.content }}</p>
                                <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                    <i class="pi pi-heart"></i>
                                    <span>{{ comment.likes }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </aside>
            </Transition>

        </div>

        <!-- Dialog d'ajout/édition de note -->
        <Dialog v-model:visible="showNoteDialog" header="Ajouter une note" :modal="true" :style="{ width: '500px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2">Contenu de la note</label>
                    <Textarea 
                        v-model="noteForm.content"
                        rows="5"
                        placeholder="Écrivez votre note ici..."
                        class="w-full"
                    />
                </div>
                
                <div>
                    <label class="block text-sm font-semibold mb-2">Couleur</label>
                    <div class="flex gap-2">
                        <button 
                            v-for="color in noteColors" 
                            :key="color"
                            @click="noteForm.color = color"
                            class="w-10 h-10 rounded-full border-2 hover:scale-110 transition-transform"
                            :class="[
                                `bg-${color}-500`,
                                noteForm.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                            ]"
                        ></button>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Annuler" @click="showNoteDialog = false" text />
                <Button 
                    label="Enregistrer" 
                    @click="saveNote" 
                    :loading="isSavingNote"
                    :disabled="!noteForm.content.trim()"
                />
            </template>
        </Dialog>

        <!-- Dialog de prévisualisation d'image -->
        <Dialog v-model:visible="showImagePreview" :modal="true" :style="{ width: '80vw' }" :dismissableMask="true">
            <template #header>
                <div class="flex items-center justify-between w-full">
                    <span>Image {{ currentImageIndex + 1 }} / {{ activeStep?.pictures.length }}</span>
                    <div class="flex gap-2">
                        <Button 
                            icon="pi pi-chevron-left" 
                            @click="previousImage"
                            :disabled="currentImageIndex === 0"
                            text
                            rounded
                        />
                        <Button 
                            icon="pi pi-chevron-right" 
                            @click="nextImage"
                            :disabled="!activeStep || currentImageIndex === activeStep.pictures.length - 1"
                            text
                            rounded
                        />
                    </div>
                </div>
            </template>
            <img 
                v-if="currentImage"
                :src="currentImage.url || `/uploads/${currentImage.filename}`" 
                alt="Preview" 
                class="w-full h-auto max-h-[70vh] object-contain"
            >
        </Dialog>

    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();

// ID de la documentation depuis l'URL
const documentationId = computed(() => route.params.id as string);

// ID de l'utilisateur (À remplacer par un vrai système d'auth)
const currentUserId = ref('user-' + Math.random().toString(36).substring(7));
const currentUserName = ref('Utilisateur');

// États de chargement
const isLoading = ref(true);
const loadError = ref<string | null>(null);

// Données de la documentation
const globalTitle = ref<string>('');
const globalBrands = ref<string[]>([]);
const documentationSteps = ref<any[]>([]);
const activeStepId = ref<string | null>(null);

// États des panels
const showNotesPanel = ref(false);
const showCommentsPanel = ref(false);

// Favori
const isFavorite = ref(false);

// Notes
const userNotes = ref<any[]>([]);
const showNoteDialog = ref(false);
const isSavingNote = ref(false);
const noteForm = ref({
    _id: null as string | null,
    content: '',
    color: 'yellow',
    stepId: null as string | null
});
const noteColors = ['yellow', 'blue', 'green', 'red', 'purple', 'orange'];

// Commentaires
const allComments = ref<any[]>([]);
const newCommentContent = ref('');

// Preview d'image
const showImagePreview = ref(false);
const currentImage = ref<any>(null);
const currentImageIndex = ref(0);

// Computed
const activeStepIndex = computed(() => 
    documentationSteps.value.findIndex(step => step.id === activeStepId.value)
);

const activeStep = computed(() => 
    documentationSteps.value.find(step => step.id === activeStepId.value)
);

const stepNotes = computed(() => 
    userNotes.value.filter(note => note.stepId === activeStepId.value)
);

const stepComments = computed(() => 
    allComments.value.filter(comment => comment.stepId === activeStepId.value)
);

// Charger la documentation
const loadDocumentation = async () => {
    isLoading.value = true;
    loadError.value = null;

    try {
        const response = await $fetch(`/api/documentation?id=${documentationId.value}`);
        
        if (!response.success || !response.data) {
            throw new Error('Documentation non trouvée');
        }

        const docData = response.data as any;
        
        globalTitle.value = docData.title || docData.content || '';
        globalBrands.value = docData.brands || [];
        documentationSteps.value = docData.children || [];
        
        if (documentationSteps.value.length > 0) {
            activeStepId.value = documentationSteps.value[0].id;
        }

        // Charger les données utilisateur
        await Promise.all([
            checkFavorite(),
            loadUserNotes(),
            loadComments()
        ]);

    } catch (error: any) {
        console.error('Error loading documentation:', error);
        loadError.value = error.message || 'Erreur lors du chargement';
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: loadError.value,
            life: 5000
        });
    } finally {
        isLoading.value = false;
    }
};

// Fonctions Favoris
const checkFavorite = async () => {
    try {
        const response = await $fetch(`/api/favorites/check?userId=${currentUserId.value}&documentationId=${documentationId.value}`);
        if (response.success) {
            isFavorite.value = response.isFavorite;
        }
    } catch (error) {
        console.error('Error checking favorite:', error);
    }
};

const toggleFavorite = async () => {
    try {
        const response = await $fetch('/api/favorites/toggle', {
            method: 'POST',
            body: {
                userId: currentUserId.value,
                documentationId: documentationId.value
            }
        });

        if (response.success) {
            isFavorite.value = response.isFavorite;
            toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: response.message,
                life: 3000
            });
        }
    } catch (error: any) {
        console.error('Error toggling favorite:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le favori',
            life: 3000
        });
    }
};

// Fonctions Notes
const loadUserNotes = async () => {
    try {
        const response = await $fetch(`/api/notes?userId=${currentUserId.value}&documentationId=${documentationId.value}`);
        if (response.success) {
            userNotes.value = response.data || [];
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
};

const openAddNoteDialog = (stepId?: string) => {
    noteForm.value = {
        _id: null,
        content: '',
        color: 'yellow',
        stepId: stepId || activeStepId.value
    };
    showNoteDialog.value = true;
};

const editNote = (note: any) => {
    noteForm.value = {
        _id: note._id,
        content: note.content,
        color: note.color,
        stepId: note.stepId
    };
    showNoteDialog.value = true;
};

const saveNote = async () => {
    if (!noteForm.value.content.trim()) return;

    isSavingNote.value = true;
    try {
        if (noteForm.value._id) {
            // Mise à jour
            const response = await $fetch(`/api/notes/${noteForm.value._id}`, {
                method: 'PUT',
                body: {
                    content: noteForm.value.content,
                    color: noteForm.value.color
                }
            });

            if (response.success) {
                await loadUserNotes();
                toast.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Note mise à jour',
                    life: 3000
                });
            }
        } else {
            // Création
            const response = await $fetch('/api/notes', {
                method: 'POST',
                body: {
                    userId: currentUserId.value,
                    documentationId: documentationId.value,
                    stepId: noteForm.value.stepId,
                    content: noteForm.value.content,
                    color: noteForm.value.color
                }
            });

            if (response.success) {
                await loadUserNotes();
                toast.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Note créée',
                    life: 3000
                });
            }
        }

        showNoteDialog.value = false;
    } catch (error: any) {
        console.error('Error saving note:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'enregistrer la note',
            life: 3000
        });
    } finally {
        isSavingNote.value = false;
    }
};

const deleteNote = async (noteId: string) => {
    try {
        const response = await $fetch(`/api/notes/${noteId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            await loadUserNotes();
            toast.add({
                severity: 'info',
                summary: 'Supprimée',
                detail: 'Note supprimée',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error('Error deleting note:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la note',
            life: 3000
        });
    }
};

// Fonctions Commentaires
const loadComments = async () => {
    try {
        const response = await $fetch(`/api/comments?documentationId=${documentationId.value}`);
        if (response.success) {
            allComments.value = response.data || [];
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
};

const addComment = async () => {
    if (!newCommentContent.value.trim()) return;

    try {
        const response = await $fetch('/api/comments', {
            method: 'POST',
            body: {
                userId: currentUserId.value,
                userName: currentUserName.value,
                documentationId: documentationId.value,
                stepId: activeStepId.value,
                content: newCommentContent.value
            }
        });

        if (response.success) {
            await loadComments();
            newCommentContent.value = '';
            toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Commentaire ajouté',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error('Error adding comment:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'ajouter le commentaire',
            life: 3000
        });
    }
};

const deleteComment = async (commentId: string) => {
    try {
        const response = await $fetch(`/api/comments/${commentId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            await loadComments();
            toast.add({
                severity: 'info',
                summary: 'Supprimé',
                detail: 'Commentaire supprimé',
                life: 3000
            });
        }
    } catch (error: any) {
        console.error('Error deleting comment:', error);
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer le commentaire',
            life: 3000
        });
    }
};

const likeComment = async (commentId: string) => {
    try {
        const response = await $fetch(`/api/comments/${commentId}/like`, {
            method: 'POST'
        });

        if (response.success) {
            await loadComments();
        }
    } catch (error: any) {
        console.error('Error liking comment:', error);
    }
};

// Fonctions Navigation
const goToPreviousStep = () => {
    if (activeStepIndex.value > 0) {
        activeStepId.value = documentationSteps.value[activeStepIndex.value - 1].id;
    }
};

const goToNextStep = () => {
    if (activeStepIndex.value < documentationSteps.value.length - 1) {
        activeStepId.value = documentationSteps.value[activeStepIndex.value + 1].id;
    }
};

const scrollToStep = (stepId: string) => {
    if (stepId) {
        activeStepId.value = stepId;
        showNotesPanel.value = false;
        showCommentsPanel.value = false;
    }
};

// Fonctions Images
const openImagePreview = (picture: any, index: number) => {
    currentImage.value = picture;
    currentImageIndex.value = index;
    showImagePreview.value = true;
};

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
        if (activeStep.value) {
            currentImage.value = activeStep.value.pictures[currentImageIndex.value];
        }
    }
};

const nextImage = () => {
    if (activeStep.value && currentImageIndex.value < activeStep.value.pictures.length - 1) {
        currentImageIndex.value++;
        currentImage.value = activeStep.value.pictures[currentImageIndex.value];
    }
};

// Utilitaires
const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Il y a ${hours}h`;
    } else {
        return d.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
};

const getStepTitle = (stepId: string) => {
    const step = documentationSteps.value.find(s => s.id === stepId);
    if (!step) return 'Documentation générale';
    const index = documentationSteps.value.indexOf(step);
    return step.title || `Étape ${index + 1}`;
};

// Lifecycle
onMounted(async () => {
    await loadDocumentation();
});
</script>

<style scoped>
/* Transition pour le panel latéral */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.3s ease;
}

.slide-left-enter-from {
    transform: translateX(100%);
}

.slide-left-leave-to {
    transform: translateX(100%);
}

/* Styles pour le contenu HTML */
.prose {
    line-height: 1.75;
}

.prose p {
    margin-bottom: 1rem;
}

.prose ul, .prose ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

.prose li {
    margin-bottom: 0.5rem;
}

.prose h1, .prose h2, .prose h3 {
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

.prose h1 {
    font-size: 2rem;
}

.prose h2 {
    font-size: 1.5rem;
}

.prose h3 {
    font-size: 1.25rem;
}
</style>

