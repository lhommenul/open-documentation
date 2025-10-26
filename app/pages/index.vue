<template>

  <div>
    <header>

    </header>

    <main>
      <div v-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-else-if="isInitialized">
        <p>Initialized</p>
      </div>
      <div v-else>
        <p>Error</p>
      </div>
    </main>

    <footer class="fixed bottom-0 left-0 right-0 mx-auto px-4 py-14 shadow-lg flex justify-center items-center">
    </footer>
  </div>
  
</template>


<script setup lang="ts">
import { useOpenDocumentation } from '~/composables/useOpenDocumentation';

const { initialize, isLoading, isInitialized } = useOpenDocumentation()



onMounted(async () => {
  
  const OpenDocumentation = await initialize()
  console.log(OpenDocumentation)
})

</script> 