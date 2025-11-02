<template>
    <div 
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer group border border-gray-100 hover:border-primary-300"
        @click="$emit('click')"
    >
        <div class="flex items-start gap-6">
            <!-- Icon -->
            <div class="w-16 h-16 bg-linear-to-br from-primary-100 to-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <i class="pi pi-file text-2xl text-primary-600"></i>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <!-- Title and metadata -->
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                            <span v-html="highlightText(documentation.title || 'Sans titre')"></span>
                        </h3>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <span class="flex items-center gap-1">
                                <i class="pi pi-clock"></i>
                                {{ formatDate(documentation.updatedAt || documentation.createdAt) }}
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="pi pi-list"></i>
                                {{ documentation.children?.length || 0 }} étape(s)
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="pi pi-wrench"></i>
                                {{ documentation.tools?.length || 0 }} outil(s)
                            </span>
                            <span v-if="documentation.pictures?.length" class="flex items-center gap-1">
                                <i class="pi pi-image"></i>
                                {{ documentation.pictures.length }} image(s)
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Content Preview -->
                <p v-if="documentation.content" class="text-sm text-gray-600 line-clamp-2 mb-3">
                    <span v-html="highlightText(documentation.content)"></span>
                </p>
                <p v-else class="text-sm text-gray-400 italic mb-3">
                    Aucun contenu disponible
                </p>

                <!-- Tools Tags -->
                <div v-if="documentation.tools?.length" class="flex items-center gap-2 flex-wrap">
                    <Chip 
                        v-for="(tool, index) in documentation.tools.slice(0, 5)" 
                        :key="index"
                        :label="tool.name"
                        class="bg-primary-50 text-primary-700 text-xs"
                    />
                    <Chip 
                        v-if="documentation.tools.length > 5"
                        :label="`+${documentation.tools.length - 5}`"
                        class="bg-gray-100 text-gray-600 text-xs"
                    />
                </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    icon="pi pi-eye" 
                    text
                    rounded
                    severity="info"
                    @click.stop="$emit('click')"
                    v-tooltip.left="'Voir'"
                />
                <Button 
                    icon="pi pi-pencil" 
                    text
                    rounded
                    severity="secondary"
                    @click.stop="$emit('click')"
                    v-tooltip.left="'Éditer'"
                />
                <Button 
                    icon="pi pi-trash" 
                    text
                    rounded
                    severity="danger"
                    @click.stop="$emit('delete')"
                    v-tooltip.left="'Supprimer'"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DocumentationData } from '~/composables/useDocumentationLoader';

interface Props {
    documentation: DocumentationData;
    searchQuery?: string;
}

const props = defineProps<Props>();
defineEmits(['click', 'delete']);

const highlightText = (text: string) => {
    if (!props.searchQuery || !text) return text;
    
    const regex = new RegExp(`(${props.searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900 px-1 rounded font-semibold">$1</mark>');
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

