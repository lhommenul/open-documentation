<template>
    <div class="container mx-auto flex flex-col gap-4">
        <p 
            class="text-sm text-gray-500 shadow-md p-2 rounded-md mb-4 h-full" 
            v-html="content"
            ref="contentRef"
        >
        </p>

        <!-- Tooltip personnalisé pour les pièces -->
        <OverlayPanel ref="partTooltip" :showCloseIcon="false" class="part-tooltip">
            <div v-if="selectedPart" class="flex flex-col gap-3 min-w-[250px]">
                <div class="flex items-center gap-2">
                    <i class="pi pi-cog text-2xl text-blue-500"></i>
                    <h3 class="font-semibold text-lg">{{ selectedPart.name }}</h3>
                </div>
                
                <img 
                    v-if="selectedPart.image" 
                    :src="selectedPart.image" 
                    :alt="selectedPart.name"
                    class="w-full h-32 object-cover rounded-md"
                />
                
                <div class="text-sm text-gray-600">
                    <p><strong>Référence:</strong> {{ selectedPart.reference }}</p>
                    <p><strong>Prix:</strong> {{ selectedPart.price }}€</p>
                    <p><strong>Stock:</strong> {{ selectedPart.stock }}</p>
                </div>

                <Button 
                    label="Voir les détails" 
                    icon="pi pi-arrow-right" 
                    size="small"
                    @click="goToPartDetails"
                    class="p-button-sm"
                />
            </div>
        </OverlayPanel>

        <!-- Menu d'ajout avec PrimeVue -->
        <OverlayPanel 
            ref="addMenuPanel" 
            :showCloseIcon="true"
            @show="focusSearchInput"
            @hide="resetMenuState"
        >
            <div class="flex flex-col gap-3 min-w-[300px]">
                <h3 class="font-semibold text-lg mb-2">Ajouter un élément</h3>
                
                <InputText 
                    ref="searchInput"
                    v-model="searchQuery" 
                    placeholder="Rechercher..." 
                    class="w-full"
                    @keydown.esc="addMenuPanel?.hide()"
                />

                <Divider class="my-2" />

                <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    <!-- Options principales (affichées seulement si pas de recherche et pas dans un sous-menu) -->
                    <div v-if="searchQuery === '' && !showPartsList && !showImageUpload">
                        <h4 class="text-sm font-semibold text-gray-600 mb-2">Actions</h4>
                        <Button
                            v-for="option in mainOptions"
                            :key="option.name"
                            :label="option.name"
                            :icon="option.icon"
                            text
                            class="w-full justify-start"
                            @click="handleMainOptionClick(option)"
                        />
                    </div>

                    <!-- Résultats de recherche ou liste des pièces disponibles -->
                    <div v-if="showPartsList || (searchQuery !== '' && !showImageUpload)">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-semibold text-gray-600">
                                {{ searchQuery !== '' ? 'Résultats de recherche' : 'Pièces disponibles' }}
                            </h4>
                            <Button 
                                v-if="showPartsList"
                                icon="pi pi-arrow-left" 
                                text 
                                size="small"
                                @click="resetMenuState"
                            />
                        </div>
                        
                        <div v-if="filteredParts.length === 0" class="text-sm text-gray-500 p-2">
                            Aucune pièce trouvée
                        </div>
                        
                        <Button
                            v-for="part in filteredParts"
                            :key="part.id"
                            text
                            class="w-full justify-start"
                            @click="addPartToContent(part)"
                        >
                            <template #default>
                                <div class="flex items-center gap-3 w-full">
                                    <i class="pi pi-cog text-blue-500"></i>
                                    <div class="flex flex-col items-start">
                                        <span class="font-medium">{{ part.name }}</span>
                                        <span class="text-xs text-gray-500">{{ part.reference }}</span>
                                    </div>
                                </div>
                            </template>
                        </Button>
                    </div>

                    <!-- Ajout d'image -->
                    <div v-if="showImageUpload">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-semibold text-gray-600">Ajouter une image</h4>
                            <Button 
                                icon="pi pi-arrow-left" 
                                text 
                                size="small"
                                @click="resetMenuState"
                            />
                        </div>
                        
                        <FileUpload 
                            mode="basic" 
                            accept="image/*" 
                            :maxFileSize="1000000"
                            @select="handleImageUpload"
                            chooseLabel="Choisir une image"
                        />
                    </div>
                </div>
            </div>
        </OverlayPanel>

        <!-- Indicateur du raccourci "/" -->
        <div class="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg text-sm">
            Appuyez sur <kbd class="bg-gray-700 px-2 py-1 rounded mx-1">/</kbd> pour ouvrir le menu
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import FileUpload from 'primevue/fileupload';

const content = ref<string>('<span data-type="part" data-part-id="1" class="part-link cursor-pointer text-blue-600 hover:text-blue-800 underline">roue arrière</span>');

const searchQuery = ref<string>('');
const contentRef = ref<HTMLElement | null>(null);
const partTooltip = ref();
const addMenuPanel = ref();
const searchInput = ref();
const selectedPart = ref<any>(null);
const showPartsList = ref<boolean>(false);
const showImageUpload = ref<boolean>(false);

// Données simulées des pièces
const partsDatabase: Record<string, any> = {
    '1': {
        id: '1',
        name: 'Roue arrière',
        reference: 'RA-2024-001',
        price: 149.99,
        stock: 5,
        image: 'https://picsum.photos/200/150?random=1'
    },
    '2': {
        id: '2',
        name: 'Frein avant',
        reference: 'FA-2024-002',
        price: 89.99,
        stock: 12,
        image: 'https://picsum.photos/200/150?random=2'
    },
    '3': {
        id: '3',
        name: 'Chaîne de transmission',
        reference: 'CT-2024-003',
        price: 45.50,
        stock: 8,
        image: 'https://picsum.photos/200/150?random=3'
    },
    '4': {
        id: '4',
        name: 'Pneu avant',
        reference: 'PA-2024-004',
        price: 79.99,
        stock: 15,
        image: 'https://picsum.photos/200/150?random=4'
    }
};

// Options du menu principal
const mainOptions = [
    {
        name: 'Ajouter une pièce',
        icon: 'pi pi-cog',
        action: 'addPart'
    },
    {
        name: 'Ajouter une image',
        icon: 'pi pi-image',
        action: 'addImage'
    },
    {
        name: 'Ajouter un outil',
        icon: 'pi pi-wrench',
        action: 'addTool'
    }
];

// Liste de toutes les pièces disponibles
const availableParts = computed(() => Object.values(partsDatabase));

// Filtrage des pièces selon la recherche
const filteredParts = computed(() => {
    if (!searchQuery.value) return availableParts.value;
    
    return availableParts.value.filter(part => 
        part.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        part.reference.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function focusSearchInput() {
    nextTick(() => {
        searchInput.value?.$el?.focus();
    });
}

function resetMenuState() {
    searchQuery.value = '';
    showPartsList.value = false;
    showImageUpload.value = false;
}

function handleMainOptionClick(option: any) {
    searchQuery.value = '';
    
    switch(option.action) {
        case 'addPart':
            showPartsList.value = true;
            showImageUpload.value = false;
            break;
        case 'addImage':
            showImageUpload.value = true;
            showPartsList.value = false;
            break;
        case 'addTool':
            console.log('Ajouter un outil - à implémenter');
            addMenuPanel.value.hide();
            break;
    }
}

function addPartToContent(part: any) {
    // Créer le HTML pour la nouvelle pièce
    const partSpan = `<span data-type="part" data-part-id="${part.id}" class="part-link cursor-pointer text-blue-600 hover:text-blue-800 underline">${part.name}</span>`;
    
    // Ajouter la pièce au contenu (à la fin pour simplifier)
    content.value += ' ' + partSpan;
    
    // Fermer le menu (resetMenuState sera appelé automatiquement via @hide)
    addMenuPanel.value.hide();
    
    // Reconfigurer les listeners sur les nouveaux éléments
    nextTick(() => {
        setupPartListeners();
    });
    
    console.log('Pièce ajoutée:', part.name);
}

function handleImageUpload(event: any) {
    const file = event.files[0];
    console.log('Image uploadée:', file);
    
    // Ici vous pouvez traiter l'upload de l'image
    // Par exemple, l'uploader vers un serveur et ajouter l'URL au contenu
    
    // Fermer le menu (resetMenuState sera appelé automatiquement via @hide)
    addMenuPanel.value.hide();
}

function listenToKeyboard() {
    window.addEventListener('keydown', handleKeyboardEvent);
}

function handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === '/') {
        event.preventDefault();
        event.stopPropagation();
        // Use the event target or a fallback to the contentRef element
        const targetElement = (event.target as HTMLElement) || contentRef.value;
        if (targetElement) {
            addMenuPanel.value.toggle({ currentTarget: targetElement } as any);
        }
    }
}

function setupPartListeners() {
    if (!contentRef.value) return;

    const partElements = contentRef.value.querySelectorAll('[data-type="part"]');
    
    partElements.forEach((element) => {
        // Retirer les anciens listeners pour éviter les doublons
        const clone = element.cloneNode(true);
        element.parentNode?.replaceChild(clone, element);
        
        // Survol - affiche le tooltip
        clone.addEventListener('mouseenter', (event) => {
            const target = event.target as HTMLElement;
            const partId = target.getAttribute('data-part-id');
            
            if (partId && partsDatabase[partId]) {
                selectedPart.value = partsDatabase[partId];
                // Pass the target element with a proper event structure
                partTooltip.value.show(event, target);
            }
        });

        // Sortie de survol
        clone.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!isHoveringTooltip()) {
                    partTooltip.value.hide();
                }
            }, 100);
        });

        // Clic - navigation vers les détails
        clone.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const partId = target.getAttribute('data-part-id');
            
            if (partId && partsDatabase[partId]) {
                goToPartDetails(partsDatabase[partId]);
            }
        });

        // Style du curseur
        (clone as HTMLElement).style.cursor = 'pointer';
    });
}

function isHoveringTooltip(): boolean {
    return partTooltip.value?.$el?.matches(':hover') || false;
}

function goToPartDetails(part?: any) {
    const partData = part || selectedPart.value;
    console.log('Navigation vers détails de la pièce:', partData);
    
    // Exemple de navigation (adapter selon votre router)
    // router.push(`/parts/${partData.id}`);
    
    alert(`Navigation vers la pièce: ${partData.name}`);
    
    partTooltip.value.hide();
}

onMounted(() => {
    console.log('Editor mounted');
    listenToKeyboard();
    
    nextTick(() => {
        setupPartListeners();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyboardEvent);
});
</script>

<style scoped>
:deep(.part-link) {
    position: relative;
    transition: all 0.2s ease;
}

:deep(.part-link:hover) {
    background-color: rgba(59, 130, 246, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
}

:deep(.part-tooltip) {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

kbd {
    font-family: monospace;
    font-size: 0.9em;
}
</style>
