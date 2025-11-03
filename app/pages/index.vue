<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header/Navbar -->
    <header class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/favicon.svg" alt="DocShare" class="w-8 h-8" />
            <h1 class="text-2xl font-bold color-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text">
              Open Documentation
            </h1>
          </div>
          <!-- <nav class="hidden md:flex items-center gap-6">
            <a href="#features" class="text-gray-600 hover:text-primary-600 transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" class="text-gray-600 hover:text-primary-600 transition-colors">Comment ça marche</a>
            <a href="#community" class="text-gray-600 hover:text-primary-600 transition-colors">Communauté</a>
            <Button label="Connexion" text class="text-gray-600" />
            <Button label="Commencer" icon="pi pi-arrow-right" iconPos="right" />
          </nav> -->
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 md:py-32">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="inline-block">
            <Chip label="🎉 Nouvelle plateforme communautaire" class="bg-primary-50 text-primary-700 font-semibold" />
          </div>
          <h2 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Partagez et découvrez des
            <span class="text-primary-600">
              documentations produits
            </span>
          </h2>
          <p class="text-xl text-gray-600">
            Une plateforme collaborative pour créer, partager et enrichir la documentation de tous vos produits et outils.
          </p>
          <div class="flex flex-wrap gap-4">
            <span 
              v-if="alphaMode" 
              class="inline-block px-4 py-2 rounded-lg bg-yellow-100 text-yellow-900 font-medium shadow-sm border border-yellow-200"
            >
              🚧 L'application est en alpha fermée, mais bientôt disponible !
            </span>
            <Button 
              v-if="!alphaMode"
              label="Créer une documentation" 
              icon="pi pi-plus" 
              size="large"
              class="px-8"
              @click="navigateTo('/documentation')"
            />
            <Button 
              v-if="!alphaMode"
              label="Explorer" 
              icon="pi pi-search" 
              outlined 
              size="large"
              class="px-8"
              @click="navigateTo('/documentation/list')"
            />
          </div>
          <div class="flex items-center gap-8 pt-4">
            <div>
              <div class="text-3xl font-bold text-gray-900">12,450+</div>
              <div class="text-sm text-gray-600">Documentations</div>
            </div>
            <div class="w-px h-12 bg-gray-300"></div>
            <div>
              <div class="text-3xl font-bold text-gray-900">3,200+</div>
              <div class="text-sm text-gray-600">Contributeurs</div>
            </div>
            <div class="w-px h-12 bg-gray-300"></div>
            <div>
              <div class="text-3xl font-bold text-gray-900">850+</div>
              <div class="text-sm text-gray-600">Marques</div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <div class="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3">
              <i class="pi pi-check text-xl"></i>
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <Avatar icon="pi pi-user" class="bg-primary-100 text-primary-700" shape="circle" />
                <div>
                  <div class="font-semibold text-gray-900">Marie Dupont</div>
                  <div class="text-sm text-gray-500">Il y a 2 heures</div>
                </div>
              </div>
              <Divider />
              <div>
                <h3 class="font-bold text-lg mb-2">Documentation iPhone 15 Pro</h3>
                <div class="flex flex-wrap gap-2 mb-3">
                  <Chip label="Apple" class="bg-gray-100" />
                  <Chip label="Smartphone" class="bg-gray-100" />
                </div>
                <p class="text-gray-600 text-sm">Guide complet d'utilisation avec photos et tutoriels détaillés...</p>
              </div>
              <div class="flex gap-2">
                <img src="https://placehold.co/80x80/e0e7ff/4f46e5?text=IMG" class="rounded-lg" alt="preview" />
                <img src="https://placehold.co/80x80/dbeafe/2563eb?text=IMG" class="rounded-lg" alt="preview" />
                <img src="https://placehold.co/80x80/e0e7ff/4f46e5?text=IMG" class="rounded-lg" alt="preview" />
              </div>
              <div class="flex items-center justify-between pt-2">
                <div class="flex gap-4 text-sm text-gray-600">
                  <span><i class="pi pi-eye mr-1"></i> 1.2k vues</span>
                  <span><i class="pi pi-heart mr-1"></i> 89</span>
                </div>
                <Button label="Voir" icon="pi pi-arrow-right" iconPos="right" size="small" text />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <Chip label="Fonctionnalités" class="mb-4 bg-primary-50 text-primary-700" />
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Des outils puissants pour créer et partager des documentations complètes et professionnelles
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-images text-3xl text-blue-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Galeries d'images</h3>
                <p class="text-gray-600">
                  Ajoutez facilement des photos et captures d'écran pour illustrer vos documentations
                </p>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-wrench text-3xl text-green-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Outils référencés</h3>
                <p class="text-gray-600">
                  Listez tous les outils nécessaires pour votre produit avec des descriptions détaillées
                </p>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-sitemap text-3xl text-purple-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Structure hiérarchique</h3>
                <p class="text-gray-600">
                  Organisez vos documentations en sections et sous-sections pour une navigation fluide
                </p>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-tags text-3xl text-orange-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Multi-marques</h3>
                <p class="text-gray-600">
                  Associez plusieurs marques et produits à une même documentation
                </p>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-users text-3xl text-pink-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Collaboration</h3>
                <p class="text-gray-600">
                  Travaillez ensemble sur des documentations et partagez vos connaissances
                </p>
              </div>
            </template>
          </Card>

          <Card class="hover:shadow-xl transition-shadow duration-300">
            <template #content>
              <div class="text-center space-y-4">
                <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                  <i class="pi pi-file-edit text-3xl text-indigo-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900">Éditeur riche</h3>
                <p class="text-gray-600">
                  Créez du contenu formaté avec un éditeur intuitif et puissant
                </p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <Chip label="Processus simple" class="mb-4 bg-primary-50 text-primary-700" />
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              1
            </div>
            <h3 class="text-xl font-bold text-gray-900">Créez</h3>
            <p class="text-gray-600">
              Commencez une nouvelle documentation en quelques clics
            </p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              2
            </div>
            <h3 class="text-xl font-bold text-gray-900">Enrichissez</h3>
            <p class="text-gray-600">
              Ajoutez du contenu, des images, des outils et des marques
            </p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              3
            </div>
            <h3 class="text-xl font-bold text-gray-900">Partagez</h3>
            <p class="text-gray-600">
              Publiez votre documentation avec la communauté
            </p>
          </div>

          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              4
            </div>
            <h3 class="text-xl font-bold text-gray-900">Collaborez</h3>
            <p class="text-gray-600">
              Améliorez ensemble les documentations existantes
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { alphaMode, fetchAlphaMode } = useAlphaMode();

// Charger le mode alpha au montage du composant
onMounted(async () => {
  await fetchAlphaMode();
});

const toggleMenu = () => {
  // Logique pour le menu mobile
  console.log('Toggle menu')
}
</script>

<style scoped>
/* Animations personnalisées si nécessaire */
</style>
