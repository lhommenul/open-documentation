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

            <div v-else class="flex flex-col h-full" >

                <header>
                    <h1 class="text-2xl font-bold text-gray-700 text-center">
                        {{ currentStep?.title }}
                    </h1>

                </header>

                <div class="flex-1" >

                </div>

                <footer class="shadow-lg rounded-md p-4" >
                    <ClientOnly>
                        <TextEditor />
                    </ClientOnly>
                </footer>

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


const languages = ref<string[]>(['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'])
const selectedLanguage = ref<string>('Français')

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