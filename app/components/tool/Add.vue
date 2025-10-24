<template>

    <div>
        <button @click="toggleModal" class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-200">
            Ajouter un outil
        </button>
    </div>


    <div 
        v-if="isOpen" 
        class="fixed bottom-0 top-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 shadow-lg justify-center items-center z-50"    
    >
        <div class="absolute right-4 top-4">
            <button type="button" @click="toggleModal" class="text-white text-2xl font-bold cursor-pointer hover:text-gray-500 transition-all duration-200">
                &times;
            </button>
        </div>
        <div 
            class="bg-white rounded-lg p-4 shadow-lg w-full max-w-md mx-auto" 
            @click.stop
        >
            <form @submit.prevent="addTool" class="flex flex-col gap-4" >
                <div class="flex flex-col gap-4">
                    <input type="text" placeholder="Nom de l'outil" name="name" required class="border border-gray-300 rounded-md p-2" autofocus>
                </div>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-200">
                    Ajouter l'outil
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">

import * as z from "zod"; 
import { Tool } from "./shemas/Tool";

const { tools } = defineProps<{
    tools: Tool[]  
}>()

const emit = defineEmits<{
    (e: 'update:tools', tools: Tool[]): void
}>()

const isOpen = ref(false)

function toggleModal() {
    isOpen.value = !isOpen.value
}

function addTool( e: Event ) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    try {
        const tool = Tool.parse(data)
        emit('update:tools', [...tools, tool])
        toggleModal()
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error(error.message)
        } else {
            console.error(error)
        }
    }
}

</script>