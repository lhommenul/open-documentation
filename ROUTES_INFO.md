# 📍 Structure des routes - Système de Documentation

## Routes disponibles

### 🏠 Page principale
```
/
```
Page d'accueil de l'application

---

### 📝 Créer une nouvelle documentation
```
/documentation
```
- **Page :** `app/pages/documentation/index.vue`
- **Description :** Interface pour créer une nouvelle documentation avec ses étapes
- **Fonctionnalités :**
  - Créer des étapes multiples avec drag & drop
  - Ajouter des outils et des images
  - Éditeur de contenu riche (Quill)
  - Sauvegarde automatique toutes les 2 secondes
  - Bouton "Publier" qui sauvegarde dans MongoDB et redirige vers l'URL avec ID

**Après publication :** Redirige automatiquement vers `/documentation/{id}`

---

### 📄 Voir/Éditer une documentation existante
```
/documentation/{id}
```
- **Page :** `app/pages/documentation/[id].vue`
- **Description :** Affiche et permet d'éditer une documentation existante
- **Fonctionnalités :**
  - **Chargement automatique** depuis MongoDB au montage de la page
  - Affiche toutes les étapes de la documentation
  - Permet l'édition en temps réel
  - Sauvegarde automatique toutes les 3 secondes
  - Navigation entre étapes
  - URL persistante - peut être rechargée sans perte de données

**Exemple :**
```
/documentation/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Bouton retour :** Permet de revenir à la liste des documentations

---

### 📚 Liste de toutes les documentations
```
/documentation/list
```
- **Page :** `app/pages/documentation/list.vue`
- **Description :** Liste toutes les documentations sauvegardées dans MongoDB
- **Fonctionnalités :**
  - Affichage en grille de toutes les documentations
  - **Recherche en texte intégral** (titre et contenu)
  - Tri par date de création, modification ou titre
  - Pagination (12 documentations par page)
  - Bouton "Nouvelle Documentation" pour créer
  - Actions rapides : Éditer et Supprimer
  - Format de carte avec aperçu :
    - Titre
    - Extrait du contenu
    - Nombre d'étapes
    - Nombre d'outils
    - Date de dernière modification

**Navigation :**
- Clic sur une carte → Redirige vers `/documentation/{id}`
- Bouton "Nouvelle Documentation" → Redirige vers `/documentation`

---

## 🔄 Flux de travail typique

### 1. Créer une nouvelle documentation

```
1. Aller sur /documentation
2. Créer des étapes avec le bouton "Nouvelle étape"
3. Ajouter du contenu, outils, images
4. Cliquer sur "Publier"
5. → Redirection automatique vers /documentation/{id}
```

### 2. Éditer une documentation existante

```
Méthode A - Depuis la liste :
1. Aller sur /documentation/list
2. Cliquer sur une documentation
3. → Redirection vers /documentation/{id}
4. Éditer le contenu
5. Sauvegarde automatique

Méthode B - URL directe :
1. Aller directement sur /documentation/{id}
2. La documentation se charge depuis MongoDB
3. Éditer le contenu
4. Sauvegarde automatique
```

### 3. Rechercher une documentation

```
1. Aller sur /documentation/list
2. Utiliser la barre de recherche
3. Entrer des mots-clés (recherche dans titre et contenu)
4. Cliquer sur un résultat
5. → Redirection vers /documentation/{id}
```

---

## 🔧 APIs utilisées

### Créer/Mettre à jour une documentation
```
POST /api/documentation
```
**Body :**
```json
{
  "id": "uuid-existant-ou-null",
  "content": "Contenu",
  "title": "Titre",
  "order": 0,
  "tools": [{"name": "Vue.js"}],
  "pictures": [],
  "children": [...]
}
```

### Récupérer une documentation par ID
```
GET /api/documentation?id={uuid}
```

### Récupérer toutes les documentations (pagination)
```
GET /api/documentation?limit=12&skip=0&sortBy=createdAt&order=desc
```

### Rechercher dans les documentations
```
GET /api/documentation/search?q=recherche&limit=20
```

### Supprimer une documentation
```
DELETE /api/documentation/{uuid}
```

---

## 🎯 Composables disponibles

### `useDocumentationLoader`
**Fichier :** `app/composables/useDocumentationLoader.ts`

Fournit des méthodes pour interagir avec MongoDB :

```typescript
const { 
  isLoading, 
  error, 
  loadDocumentationById, 
  loadDocumentations, 
  searchDocumentations, 
  deleteDocumentation 
} = useDocumentationLoader();

// Charger une doc par ID
const doc = await loadDocumentationById('uuid');

// Charger une liste avec pagination
const result = await loadDocumentations({
  limit: 12,
  skip: 0,
  sortBy: 'createdAt',
  order: 'desc'
});

// Rechercher
const results = await searchDocumentations('query');

// Supprimer
const success = await deleteDocumentation('uuid');
```

---

## 🚀 Avantages du système d'URL avec ID

✅ **URLs partageables** : Vous pouvez partager un lien direct vers une documentation

✅ **Rechargement de page** : F5 / Ctrl+R fonctionne sans perte de données

✅ **Navigation navigateur** : Les boutons précédent/suivant fonctionnent

✅ **Bookmarks** : Possibilité de mettre en favori une documentation spécifique

✅ **SEO-friendly** : URLs propres et indexables

✅ **Deep linking** : Possibilité de pointer directement vers une doc depuis l'extérieur

---

## 💾 Persistance des données

- **Création** : Les données sont sauvegardées dans MongoDB lors du clic sur "Publier"
- **Édition** : Sauvegarde automatique toutes les 3 secondes sur `/documentation/{id}`
- **Chargement** : Automatique depuis MongoDB au montage de la page `/documentation/{id}`

---

## 📱 Exemples d'utilisation

### Partager une documentation
```
Envoyez simplement le lien :
https://votresite.com/documentation/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### Ouvrir plusieurs documentations en même temps
```
Onglet 1: /documentation/id-doc-1
Onglet 2: /documentation/id-doc-2
Onglet 3: /documentation/id-doc-3
```

### Revenir à une documentation après des jours
```
Le lien reste valide indéfiniment tant que la doc existe dans MongoDB
```

---

## 🔐 Sécurité

⚠️ **Note :** Actuellement, aucune authentification n'est implémentée. 
Toute personne avec l'URL peut accéder à une documentation.

Pour ajouter de la sécurité, vous pourriez :
- Ajouter un système d'authentification
- Implémenter des permissions (public/privé)
- Ajouter un système de partage avec tokens
- Mettre en place des rôles utilisateurs

---

## 🎨 Navigation UX

```
┌─────────────────┐
│   /             │  Page d'accueil
│                 │
└────────┬────────┘
         │
         ├─→ /documentation  (Créer nouvelle doc)
         │        │
         │        └─→ Publier → /documentation/{id}
         │
         └─→ /documentation/list  (Liste des docs)
                  │
                  └─→ Clic sur carte → /documentation/{id}
                           │
                           └─→ Bouton retour → /documentation/list
```

---

## 🛠️ Fichiers modifiés/créés

### Nouveaux fichiers
- ✅ `app/pages/documentation/[id].vue` - Page dynamique pour afficher/éditer une doc
- ✅ `app/pages/documentation/list.vue` - Liste de toutes les docs
- ✅ `app/composables/useDocumentationLoader.ts` - Composable pour charger des docs

### Fichiers modifiés
- ✅ `app/api/uploadDocumentation.ts` - Ajout du paramètre `existingId`
- ✅ `app/pages/documentation/index.vue` - Redirection après publication

### APIs backend (déjà créées)
- ✅ `server/api/documentation.post.ts` - Create/Update
- ✅ `server/api/documentation.get.ts` - Read
- ✅ `server/api/documentation/[id].delete.ts` - Delete
- ✅ `server/api/documentation/search.get.ts` - Search

---

Votre système de documentation est maintenant **complètement fonctionnel** avec des URLs persistantes et rechargeables ! 🎉

