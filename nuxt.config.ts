import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  modules: ['@nuxt/eslint', '@primevue/nuxt-module'],
  devServer: {
    port: 3030,
    host: '0.0.0.0'
  },
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
})