<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>


<script setup lang="ts">
import Toast from 'primevue/toast';
import 'primeicons/primeicons.css'

useSeoMeta({
  title: 'Open Documentation',
  description: 'Open documentation by Thirdshop',
  ogTitle: 'Open Documentation',
  ogDescription: 'Open documentation by Thirdshop',
})
</script>