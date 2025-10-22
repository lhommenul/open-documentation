<template>
    <div class="h-screen w-screen grid grid-cols-3 p-8 gap-8 bg-gray-50" >
        <div class="bg-white w-full h-full rounded-2xl col-span-2 p-6 shadow">
            <div v-if="steps.length === 0" >
                <p class="text-gray-500">Aucune étape</p>
                <button 
                    @click="addStep(true)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Ajouter une étape
                </button>
            </div>

            <div v-else >

                <header>
                    <h1>
                        {{ currentStep?.title }}
                    </h1>
                </header>

            </div>


        </div>
        <div class="bg-white w-full h-full rounded-2xl p-6 shadow">
            <ul>
                <li
                    v-for="step in steps"
                    :key="step.id"
                    @click="activateStep(step.id)"
                    :class="{
                        'bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-4 cursor-pointer transform transition-all duration-200 hover:scale-103 hover:shadow-xl border-l-4 border-transparent': true,
                        'border-blue-500 ring-2 ring-blue-500 ring-opacity-50': step.active // Exemple: ajoute une classe si l'étape est active
                    }"
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
                        <div class="flex space-x-2">
                        <button
                            type="button"
                            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm"
                        >
                            Activer
                        </button>
                        <button
                            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out text-sm"
                            @click.stop="removeStep(step.id)"
                            type="button"
                        >
                            Supprimer
                        </button>
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-200 leading-relaxed mt-2 text-base">
                        {{ step.content }}
                    </p>
                    </li>

            </ul>
            <hr>
        </div>
    </div>
</template>

<script setup lang="ts">

type Step = {
    id: number
    title: string
    description: string
    content: string
    active: boolean
}

const steps = ref<Step[]>([])

const currentStep = computed(()=> steps.value.find(step => step.active))

function addStep( activeStep = false ) {

    steps.value.push({
        id: steps.value.length + 1,
        title: 'Titre de l\'étape',
        description: 'Description de l\'étape',
        content: 'Contenu de l\'étape',
        active: activeStep
    })
}

function removeStep(id: number) {
    steps.value = steps.value.filter(step => step.id !== id)
}

function activateStep(id: number) {
    steps.value.forEach(step => step.active = step.id === id)
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