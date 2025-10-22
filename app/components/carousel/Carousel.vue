<template>
    <div class="w-full h-full flex flex-col gap-4">
        <!-- Mode Upload -->
        <div v-if="mode === 'upload'" class="space-y-4">
            <!-- Upload depuis URL -->
            <div class="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Ajouter depuis une URL
                </label>
                <div class="flex gap-2">
                    <input
                        v-model="imageUrl"
                        type="text"
                        placeholder="https://exemple.com/image.jpg"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="addImageFromUrl"
                    />
                    <button
                        @click="addImageFromUrl"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                        Ajouter
                    </button>
                </div>
            </div>

            <!-- Upload depuis fichier local -->
            <div class="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Ajouter depuis des fichiers locaux
                </label>
                <div
                    @drop.prevent="handleDrop"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    :class="[
                        'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                    ]"
                >
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        multiple
                        class="hidden"
                        @change="handleFileSelect"
                    />
                    <div class="space-y-2">
                        <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="text-gray-600">
                            Glissez-déposez vos images ici ou
                            <button
                                @click="triggerFileInput"
                                class="text-blue-500 hover:text-blue-600 font-medium"
                            >
                                parcourez
                            </button>
                        </p>
                        <p class="text-sm text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Carrousel d'images -->
        <div v-if="images.length > 0" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex-1 flex flex-col">
            <!-- Image principale -->
            <div class="relative flex-1 bg-gray-100 flex items-center justify-center">
                <img
                    :src="images[currentIndex].url"
                    :alt="images[currentIndex].name"
                    class="max-w-full max-h-full object-contain"
                />

                <!-- Bouton supprimer (mode upload) -->
                <button
                    v-if="mode === 'upload'"
                    @click="removeImage(currentIndex)"
                    class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 shadow-lg"
                    title="Supprimer cette image"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Boutons de navigation -->
                <button
                    v-if="images.length > 1"
                    @click="previousImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    v-if="images.length > 1"
                    @click="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <!-- Miniatures et indicateurs -->
            <div class="p-4 bg-white border-t border-gray-200">
                <div class="flex items-center justify-center gap-2 mb-2">
                    <span class="text-sm text-gray-600 font-medium">
                        {{ currentIndex + 1 }} / {{ images.length }}
                    </span>
                </div>
                
                <!-- Miniatures -->
                <div class="flex gap-2 overflow-x-auto pb-2 justify-center">
                    <button
                        v-for="(image, index) in images"
                        :key="index"
                        @click="currentIndex = index"
                        :class="[
                            'shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                            currentIndex === index
                                ? 'border-blue-500 scale-110 shadow-lg'
                                : 'border-gray-300 hover:border-gray-400'
                        ]"
                    >
                        <img
                            :src="image.url"
                            :alt="image.name"
                            class="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </div>
        </div>

        <!-- Message si aucune image -->
        <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500 text-lg">
                {{ mode === 'upload' ? 'Aucune image ajoutée' : 'Aucune image à afficher' }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface CarouselImage {
    url: string
    name: string
}

interface Props {
    mode: 'upload' | 'read'
    initialImages?: CarouselImage[]
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'read',
    initialImages: () => []
})

const emit = defineEmits<{
    update: [images: CarouselImage[]]
}>()

const images = ref<CarouselImage[]>([...props.initialImages])
const currentIndex = ref(0)
const imageUrl = ref('')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

// Ajouter une image depuis une URL
function addImageFromUrl() {
    if (!imageUrl.value.trim()) return

    try {
        const url = new URL(imageUrl.value)
        const name = url.pathname.split('/').pop() || 'Image'
        
        images.value.push({
            url: imageUrl.value,
            name: name
        })
        
        imageUrl.value = ''
        currentIndex.value = images.value.length - 1
        emit('update', images.value)
    } catch (error) {
        alert('URL invalide. Veuillez entrer une URL valide.')
    }
}

// Gérer la sélection de fichiers
function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (files) {
        processFiles(Array.from(files))
    }
}

// Gérer le glisser-déposer
function handleDrop(event: DragEvent) {
    isDragging.value = false
    const files = event.dataTransfer?.files
    if (files) {
        processFiles(Array.from(files))
    }
}

// Traiter les fichiers
function processFiles(files: File[]) {
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert(`${file.name} n'est pas une image valide.`)
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            images.value.push({
                url: e.target?.result as string,
                name: file.name
            })
            currentIndex.value = images.value.length - 1
            emit('update', images.value)
        }
        reader.readAsDataURL(file)
    })
}

// Déclencher l'input file
function triggerFileInput() {
    fileInput.value?.click()
}

// Navigation dans le carrousel
function nextImage() {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
}

function previousImage() {
    currentIndex.value = currentIndex.value === 0 
        ? images.value.length - 1 
        : currentIndex.value - 1
}

// Supprimer une image
function removeImage(index: number) {
    images.value.splice(index, 1)
    if (currentIndex.value >= images.value.length) {
        currentIndex.value = Math.max(0, images.value.length - 1)
    }
    emit('update', images.value)
}

// Support clavier
onMounted(() => {
    const handleKeydown = (e: KeyboardEvent) => {
        if (images.value.length <= 1) return
        
        if (e.key === 'ArrowLeft') {
            previousImage()
        } else if (e.key === 'ArrowRight') {
            nextImage()
        }
    }
    
    window.addEventListener('keydown', handleKeydown)
    
    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
})

// Surveiller les changements de props
watch(() => props.initialImages, (newImages) => {
    images.value = [...newImages]
    currentIndex.value = 0
}, { deep: true })
</script>

<style scoped>
/* Animation pour le glisser-déposer */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
</style>

