<template>
    <div class="min-h-screen bg-white flex items-center justify-center px-4">
      <div class="max-w-2xl w-full text-center py-20">
  
        <!-- Titre principal -->
        <h1 class="text-6xl font-bold text-gray-900 mb-4">
          Open Documentation
        </h1>
  
        <!-- Entreprise -->
        <p class="text-xl text-gray-500 mb-12">
          par <span class="text-blue-600 font-semibold">thirdshop</span>
        </p>
  
        <!-- Message -->
        <div class="mb-12">
          <span class="inline-block bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-lg font-medium mb-8">
            Bientôt disponible
          </span>
          
          <p class="text-2xl text-gray-600 leading-relaxed">
            Nous préparons quelque chose de nouveau.<br/>
            Revenez bientôt.
          </p>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const email = ref('')
  const success = ref(false)
  
  const handleSubmit = () => {
    console.log('Email:', email.value)
    success.value = true
    email.value = ''
    
    setTimeout(() => {
      success.value = false
    }, 3000)
  }
  </script>
  
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, sans-serif;
  }
  </style>
  