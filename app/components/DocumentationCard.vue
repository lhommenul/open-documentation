<template>
    <div 
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-primary-300"
        @click="$emit('click')"
    >
        <!-- Header with gradient -->
        <div class="h-2 bg-linear-to-r from-primary-500 to-indigo-500"></div>
        
        <div class="p-6">
            <!-- Title -->
            <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {{ documentation.title || 'Sans titre' }}
                </h3>
                <i class="pi pi-file text-primary-500 text-xl shrink-0 ml-2"></i>
            </div>
            
            <!-- Content Preview -->
            <p v-if="documentation.content" class="text-sm text-gray-600 line-clamp-3 mb-4">
                {{ documentation.content }}
            </p>
            <p v-else class="text-sm text-gray-400 italic mb-4">
                Aucun contenu disponible
            </p>

            <!-- Metadata -->
            <div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
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

            <!-- Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-500">
                    <i class="pi pi-clock mr-1"></i>
                    {{ formatDate(documentation.updatedAt || documentation.createdAt) }}
                </span>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        icon="pi pi-eye" 
                        text
                        rounded
                        size="small"
                        severity="info"
                        @click.stop="$emit('click')"
                        v-tooltip.top="'Voir'"
                    />
                    <Button 
                        icon="pi pi-pencil" 
                        text
                        rounded
                        size="small"
                        severity="secondary"
                        @click.stop="$emit('click')"
                        v-tooltip.top="'Éditer'"
                    />
                    <Button 
                        icon="pi pi-trash" 
                        text
                        rounded
                        size="small"
                        severity="danger"
                        @click.stop="$emit('delete')"
                        v-tooltip.top="'Supprimer'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DocumentationData } from '~/composables/useDocumentationLoader';

interface Props {
    documentation: DocumentationData;
}

defineProps<Props>();
defineEmits(['click', 'delete']);

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

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

