<template>

    <div>

        <div class="flex flex-col gap-4">
            <InputText id="name" class="flex-auto" autofocus placeholder="Rechercher un outil" v-model="toolName" />
        </div>

        <footer>
            <Button label="Ajouter" @click="addTool" />
        </footer>

    </div>
    
</template>

<script setup lang="ts">
import * as z from "zod"; 
import { Tool } from "./shemas/Tool";

const { tools } = defineProps<{
    tools: Tool[]  
}>()

const emit = defineEmits<{
    (e: 'add:tool', tool: Tool): void
}>()

const toolName = ref<string>('');

const addTool = () => {
    console.log(toolName.value)
    emit('add:tool', {
        name: toolName.value
    })
    toolName.value = ''
}

</script>