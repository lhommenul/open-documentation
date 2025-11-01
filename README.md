# 📚 Open Documentation

Application Nuxt 3 pour créer et gérer des documentations interactives avec étapes, images et outils.

## ✨ Fonctionnalités

- 📝 **Éditeur de documentation** avec support d'étapes multiples
- 🖼️ **Upload et traitement d'images** (auto-rotation, normalisation, compression)
- 🔧 **Gestion d'outils** associés à chaque étape
- 📊 **Réorganisation drag & drop** des étapes
- 💾 **Sauvegarde automatique** avec throttle (2 secondes)
- 🚀 **Publication** de la documentation complète
- 🎨 **Interface moderne** avec PrimeVue et Tailwind CSS

## 🏗️ Architecture

```
app/
├── api/                    # Clients API
│   ├── uploadImage.ts      # Upload d'images
│   └── uploadDocumentation.ts # Upload de documentation
├── pages/                  # Pages Nuxt
│   └── documentation/      # Interface d'édition
├── schemas/                # Schémas de données TypeScript
│   ├── documentation/      # Documentation & étapes
│   ├── picture/            # Gestion des images
│   └── tool/               # Gestion des outils
└── shared/                 # Utilitaires partagés

server/
├── api/                    # API Routes Nuxt
│   ├── upload.post.ts      # Endpoint upload d'images
│   └── documentation.post.ts # Endpoint upload de documentation
├── config/                 # Configuration
└── utils/                  # Utilitaires serveur
```

## 🚀 Migration Backend

**Nouveau !** Le backend est maintenant intégré directement dans Nuxt.

📖 Voir [MIGRATION.md](./MIGRATION.md) pour migrer depuis Express/Deno.

## 📝 Documentation

- [Guide de Migration](./MIGRATION.md) - Migration depuis Express/Deno
- [Documentation Serveur](./server/README.md) - API Routes et configuration

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
