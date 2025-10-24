<template>
    <div class="h-screen w-screen grid grid-cols-3 p-8 gap-8 bg-gray-50" >
        <div class="bg-white w-full h-full rounded-2xl col-span-2 p-6 gap-4 shadow">

            <div class="flex flex-col h-full" >

                <header>
                    <h1 class="text-2xl font-bold text-gray-700 text-center">
                        {{ currentStep?.title }}
                    </h1>

                </header>

                <div class="grid grid-cols-2 grid-rows-2 gap-4 h-full" >

                    <div class="col-span-1 row-span-1 bg-gray-100 rounded-2xl hover:shadow" >
                        <Carousel mode="upload" />
                    </div>

                    <div class="col-span-1 row-span-1 bg-gray-100 rounded-2xl hover:shadow" >
                        <TextEditor />
                    </div>

                    <div class="col-span-1 row-span-1 bg-gray-100 rounded-2xl hover:shadow" >
                        <ul>
                            <li v-for="tool in tools" :key="tool.name">
                                <span class="text-gray-600 dark:text-gray-300 text-sm">
                                    {{ tool.name }}
                                </span>
                            </li>
                        </ul>
                        <ToolAdd :tools="tools" @update:tools="updateTools" />
                    </div>


                </div>

            </div>


        </div>
        <div class="bg-white w-full h-full rounded-2xl p-6 shadow">
            <ul>
                <li
                    v-for="step in steps"
                    :key="step.id"
                    @click="activateStep(step.id)"
                    class="p-4 bg-white rounded-lg shadow-md"
                >
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                {{ step.title }}
                            </p>
                            <p class="text-gray-600 dark:text-gray-300 text-sm">
                                {{ step.description }}
                            </p>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as z from "zod";

import { Tool } from "~/components/tool/shemas/Tool";

type Step = {
    id: number
    title: string
    description: string
    content: string
    active: boolean
}

const steps = ref<Step[]>([])

const currentStep = computed(()=> steps.value.find(step => step.active))

function activateStep(id: number) {
    steps.value.forEach(step => step.active = step.id === id)
}

const tools = ref<Tool[]>([])
function updateTools(newTools: Tool[]) {
    tools.value = newTools
}

onMounted(() => {
    const fakeSteps = [{
        id: 1,
        title: 'Titre de l\'étape',
        description: 'Description de l\'étape',
        content: 'Contenu de l\'étape',
        active: true
    }]

    steps.value = fakeSteps
    
})

</script>