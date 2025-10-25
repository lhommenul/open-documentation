<template>
    <div class="bg-white w-full h-full rounded-2xl p-6 shadow gap-4 flex flex-col">
        <ul class="flex flex-col gap-4">
            <li
                v-for="step in stepsToDisplay"
                :key="step.id"
                @click="activateStep(step.id)"
                class="p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 cursor-pointer"
            >
                <Tag severity="danger" value="Active" v-if="step.active" ></Tag>
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {{ step.title }}
                        </p>
                        <div    
                            class="text-gray-600 dark:text-gray-300 text-sm h-8 text-ellipsis overflow-hidden" 
                            v-html="step.description" 
                        />
                    </div>
                </div>
            </li>

        </ul>
        <div>
            <Button label="Ajouter une étape" @click="addStep" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StepType } from './schemas/Step';

const { steps } = defineProps<{
    steps: StepType[]
}>();

const stepsToDisplay = computed(() => {
    return steps.sort((a, b) => a.id - b.id)
})

const emit = defineEmits<{
    (e: 'update:steps', steps: StepType[]): void
}>();

function addStep(): void {

    const newStepID = steps.length + 1;
    
    emit('update:steps', [...steps.map( step => ({ ...step, active: false })), {
        id: newStepID,
        title: 'Titre de l\'étape',
        description: 'Description de l\'étape',
        content: 'Contenu de l\'étape',
        active: true
    }])

}

function activateStep(id: number): void {
    
    emit('update:steps', steps.map(step => ({
        ...step,
        active: step.id === id
    })))

}

</script>