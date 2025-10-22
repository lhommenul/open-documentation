<template>
    <div class="h-full w-full" >   
        <div id="editor" class="border w-full h-full border-gray-200 rounded-md p-4">
        </div>
    </div>
</template>

<script setup lang="ts">
import Quill from 'quill';

onMounted(() => {

    const quill = new Quill('#editor', {
        debug: 'info',
        modules: {
            toolbar: true,
        },
        placeholder: 'Compose an epic...',
    });

    
})

</script>