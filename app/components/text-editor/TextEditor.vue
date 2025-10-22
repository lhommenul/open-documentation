<template>
    <div class="h-full w-full" >   
        <div id="editor" class="w-full h-full">
        </div>
    </div>
</template>

<script setup lang="ts">
import Quill from 'quill';

onMounted(() => {

    new Quill('#editor', {
        debug: 'info',
        modules: {
            toolbar: true,
        },
        placeholder: 'Compose an epic...',
    });

    
})

</script>