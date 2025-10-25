<template>
    <div class="h-screen w-screen grid grid-cols-3 p-8 gap-8 bg-gray-50" >

        <StepsEditor v-if="activeStep" v-model:step="activeStep" />

        <StepsList v-model:steps="steps" />

    </div>
</template>

<script setup lang="ts">    
import type { StepType } from '~/components/steps/schemas/Step';



const steps = ref<StepType[]>([])

const activeStep = ref<StepType | null>(null)

watch(steps, (newSteps) => {
    
    const newStep = newSteps.find(step => step.active)
    console.log(newStep)
    if (!newStep) {
        activeStep.value = null;
        return;
    }

    console.log(newStep)

    activeStep.value = newStep;

})

</script>