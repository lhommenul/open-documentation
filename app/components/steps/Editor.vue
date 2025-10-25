<template>
<div class="bg-white w-full h-full rounded-2xl col-span-2 p-6 gap-4 shadow">

    <div class="flex flex-col h-full gap-4" >

        <header>
            <h1 class="text-2xl font-bold text-gray-700 text-center">
                <InputText v-model="activeStep.title" />
            </h1>

        </header>

        <div class="grid h-full" >

            <Editor v-model="activeStep.description" editorStyle="height: 320px" />

        </div>

        <div>
            <ul class="flex flex-row gap-2" >
                <li v-for="tool in tools" :key="tool.name">

                <Chip :label="tool.name" removable  />
                </li>

            </ul>
        </div>

        <Dialog v-model:visible="uploadpicturesModalIsOpen" modal header="Upload des photos" :style="{ width: '25rem' }">

            <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
                <template #empty>
                    <span>Drag and drop files to here to upload.</span>
                </template>
            </FileUpload>

        </Dialog>

        <Dialog v-model:visible="isToolsModalOpen" modal header="Upload des outils" :style="{ width: '25rem' }">

            <ToolAdd :tools="tools" @add:tool="addTool" />

        </Dialog>

        <footer>
            <MegaMenu :model="menuStepItems" orientation="horizontal" />
        </footer>

    </div>

</div>
</template>

<script setup lang="ts">
import { Tool } from "~/components/tool/shemas/Tool";
import Editor from 'primevue/editor';
import MegaMenu from 'primevue/megamenu';
import type { StepType } from './schemas/Step';

const { step } = defineProps<{
    step: StepType
}>();

const activeStep = ref<StepType>(step)

watch(()=>step, (newStep) => {
    activeStep.value = newStep
}, { immediate: true })

const uploadpicturesModalIsOpen = ref(false)

const isToolsModalOpen = ref(false);

type MenuItem = {
    label: string
    icon: string
    command: () => void
}

const menuStepItems = ref<MenuItem[]>([
    {
        label: 'Ajouter des photos',
        icon: 'pi pi-step-forward',
        command: () => {
            uploadpicturesModalIsOpen.value = true
        }
    },
    {
        label: 'Ajouter des outils',
        icon: 'pi pi-step-forward',
        command: () => {
            isToolsModalOpen.value = true
        }
    }
])


const tools = ref<Tool[]>([])
function addTool(tool: Tool): void {
    tools.value.push(tool)
}

function onAdvancedUpload(event: any): void {
    // Handle the file upload event
    console.log('Files uploaded:', event)
}


</script>