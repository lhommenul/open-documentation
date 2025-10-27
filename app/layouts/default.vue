<template>

    <div v-if="isInitialized && !isLoading" class="flex flex-col h-screen w-screen" >

        <slot name="header" />
        <slot />
        <slot name="footer" />

    </div>
    <div v-else-if="isLoading" class="flex flex-col h-screen w-screen justify-center items-center" >
        <p>Loading...</p>

    </div>
    <div v-else class="flex flex-col h-screen w-screen justify-center items-center" >
        <p>Error</p>
    </div>
    
</template>
  
  
<script setup lang="ts">
  import { useOpenDocumentation } from '~/composables/useOpenDocumentation';
  
  const { initialize, isLoading, isInitialized } = useOpenDocumentation();
  
  onMounted(async () => {
    
    const application = await initialize()
  
  })
  
  </script> 