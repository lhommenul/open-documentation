import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@primevue/nuxt-module'],
  vite: {    
    plugins: [      
      tailwindcss(),    
    ],  
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  css: ['~/assets/css/main.css'],
  pages: true,
  runtimeConfig: {
    public: {
      // Set defaults; override at runtime via env vars:
      // NUXT_PUBLIC_OPEN_COMMUNICATION_API_URL, NUXT_PUBLIC_OPEN_COMMUNICATION_API_PORT
      openCommunicationApiUrl: 'http:127.0.0.1:8080',
    }
  }
})