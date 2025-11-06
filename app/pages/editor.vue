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

        <div 
            v-if="displayOptions" 
            class="relative shadow-md p-2 rounded-md" 
        >
            <input 
                type="text" 
                class="w-full shadow-md p-2 rounded-md" 
                autofocus 
                placeholder="Rechercher..." 
                v-model="searchQuery" 
            />
            <ul>
                <li 
                    v-for="option in filteredOptions" 
                    :key="option.name"
                    class="flex items-center gap-2" 
                >
                    <button type="button" @click="handleOptionClick(option)">
                        <i :class="option.icon"></i>
                        <span>{{ option.name }}</span>
                    </button>
                </li>   
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';
import Button from 'primevue/button';

const content = ref<string>('<span data-type="part" data-part-id="1" class="part-link cursor-pointer text-blue-600 hover:text-blue-800 underline">roue arrière</span>');

const searchQuery = ref<string>('');
const contentRef = ref<HTMLElement | null>(null);
const partTooltip = ref();
const selectedPart = ref<any>(null);

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
    }
};

const options = [
    {
        name: 'Ajouter un outil',
        icon: 'pi pi-plus',
    },
    {
        name: 'Ajouter une image',
        icon: 'pi pi-plus'
    }
];

const filteredOptions = computed(() => {
    return options.filter(option => option.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const displayOptions = ref<boolean>(false);

function handleOptionClick(option: any) {
    console.log('Option clicked:', option);
}

function listenToKeyboard() {
    window.addEventListener('keydown', handleKeyboardEvent);
}

function handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && displayOptions.value) {
        displayOptions.value = false;
        return;
    }

    if (event.key === '/') {
        event.preventDefault();
        event.stopPropagation();
        displayOptions.value = true;
    }
}

function setupPartListeners() {
    if (!contentRef.value) return;

    const partElements = contentRef.value.querySelectorAll('[data-type="part"]');
    
    partElements.forEach((element) => {
        // Survol - affiche le tooltip
        element.addEventListener('mouseenter', (event) => {
            const target = event.target as HTMLElement;
            const partId = target.getAttribute('data-part-id');
            
            if (partId && partsDatabase[partId]) {
                selectedPart.value = partsDatabase[partId];
                partTooltip.value.show(event);
            }
        });

        // Sortie de survol - cache le tooltip après un délai
        element.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!isHoveringTooltip()) {
                    partTooltip.value.hide();
                }
            }, 100);
        });

        // Clic - navigation vers les détails
        element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const partId = target.getAttribute('data-part-id');
            
            if (partId && partsDatabase[partId]) {
                goToPartDetails(partsDatabase[partId]);
            }
        });

        // Style du curseur
        (element as HTMLElement).style.cursor = 'pointer';
    });
}

function isHoveringTooltip(): boolean {
    // Vérifie si la souris est sur le tooltip
    return partTooltip.value?.$el?.matches(':hover') || false;
}

function goToPartDetails(part?: any) {
    const partData = part || selectedPart.value;
    console.log('Navigation vers détails de la pièce:', partData);
    
    // Exemple de navigation (adapter selon votre router)
    // router.push(`/parts/${partData.id}`);
    
    // Ou ouvrir dans un modal, etc.
    alert(`Navigation vers la pièce: ${partData.name}`);
    
    partTooltip.value.hide();
}

onMounted(() => {
    console.log('Editor mounted');
    listenToKeyboard();
    
    // Attendre que le DOM soit mis à jour avec v-html
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
</style>
