# Backend Nuxt - Documentation API

Ce projet utilise le backend intégré de Nuxt pour gérer les uploads d'images et de documentation.

## 📁 Structure

```
server/
├── api/
│   ├── upload.post.ts         # Upload d'images avec traitement
│   └── documentation.post.ts  # Upload de documentation avec étapes
├── middleware/
│   └── auth.ts               # Middleware d'authentification (placeholder)
└── utils/
    └── fileUpload.ts         # Utilitaires pour la gestion des fichiers
```

## 🔌 Endpoints disponibles

### POST `/api/upload`

Upload et traitement d'une image.

**Body:** FormData avec un champ `image`

**Response:**
```json
{
  "filename": "1234567890-abc-normalized.jpg",
  "path": "public/uploads/1234567890-abc-normalized.jpg",
  "url": "/uploads/1234567890-abc-normalized.jpg",
  "size": 123456,
  "mimetype": "image/jpeg"
}
```

**Traitement appliqué:**
- Auto-rotation basée sur EXIF
- Normalisation du contraste/luminosité
- Compression JPEG (qualité 85%)
- Limite de taille: 5MB

### POST `/api/documentation`

Upload d'une documentation complète avec ses étapes (children).

**Body:**
```json
{
  "id": "uuid-or-null",
  "content": "Contenu de la documentation",
  "order": 0,
  "title": "Titre optionnel",
  "tools": [
    { "name": "Nom de l'outil" }
  ],
  "pictures": [
    {
      "filename": "image.jpg",
      "url": "/uploads/image.jpg",
      "rawFilename": "original-name.jpg"
    }
  ],
  "children": [
    {
      "id": "child-uuid",
      "content": "Contenu de l'étape",
      "order": 0,
      "title": "Étape 1",
      "tools": [],
      "pictures": [],
      "children": []
    }
  ]
}
```

**Response:**
```json
{
  "documentationId": "generated-or-provided-uuid",
  "message": "Documentation uploaded successfully",
  "childrenCount": 3,
  "uploadedAt": "2025-11-01T12:34:56.789Z"
}
```

## 🔐 Authentification

Le middleware d'authentification est actuellement un placeholder. Pour l'activer :

1. Modifier `server/middleware/auth.ts`
2. Implémenter votre logique (JWT, session, etc.)
3. Les requêtes non autorisées recevront un code 401

## 📦 Stockage des fichiers

Les fichiers uploadés sont stockés dans `public/uploads/` :
- Accessible via `/uploads/filename.jpg`
- Ignoré par Git (voir `.gitignore`)
- Nettoyage automatique disponible via `cleanOldUploads()`

## 🚀 Migration depuis Express

### Avant (Express/Deno)
```javascript
const endpoint = buildOpenCommunicationUrl('/upload');
fetch(endpoint, ...)
```

### Après (Nuxt intégré)
```javascript
fetch('/api/upload', ...)
```

## 🛠️ Développement

### Tester les endpoints

```bash
# Upload d'image
curl -X POST http://localhost:3000/api/upload \
  -F "image=@./test-image.jpg"

# Upload de documentation
curl -X POST http://localhost:3000/api/documentation \
  -H "Content-Type: application/json" \
  -d '{"id":null,"content":"Test","order":0,"tools":[],"pictures":[],"children":[]}'
```

### Ajouter un nouvel endpoint

Créer un fichier dans `server/api/` :
- `monEndpoint.get.ts` → GET `/api/monEndpoint`
- `monEndpoint.post.ts` → POST `/api/monEndpoint`
- `monEndpoint/[id].get.ts` → GET `/api/monEndpoint/:id`

## 📝 TODO

- [ ] Implémenter la persistance réelle (DB/IPFS)
- [ ] Ajouter l'authentification
- [ ] Mettre en place le nettoyage automatique des vieux uploads
- [ ] Ajouter des tests unitaires
- [ ] Implémenter la compression d'images avancée
- [ ] Ajouter des limites de rate-limiting

## 🔗 Ressources

- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 Framework](https://h3.unjs.io/)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

