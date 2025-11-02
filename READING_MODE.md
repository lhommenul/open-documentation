# Mode Lecture de Documentation

## Vue d'ensemble

La page de lecture de documentation permet aux utilisateurs de consulter les documentations en mode lecture seule avec des fonctionnalités interactives avancées :

- ✅ **Favoris** : Marquer des documentations comme favorites
- ✅ **Notes personnelles** : Ajouter des notes privées sur les documentations
- ✅ **Commentaires** : Participer à des discussions publiques sur les documentations

## Accès

Pour accéder à la page de lecture d'une documentation :

```
/documentation/read/{documentationId}
```

Par exemple : `/documentation/read/123e4567-e89b-12d3-a456-426614174000`

## Fonctionnalités

### 1. Navigation

#### Barre latérale gauche
- Liste de toutes les étapes de la documentation
- Badge indiquant le numéro de chaque étape
- Compteurs d'outils et d'images pour chaque étape
- Clic pour naviguer entre les étapes

#### Navigation entre étapes
- Boutons "Précédent" et "Suivant" dans l'en-tête de chaque étape
- Navigation au clavier (à venir)

### 2. Favoris

#### Ajouter/Retirer des favoris
- Cliquez sur l'icône ❤️ dans l'en-tête
- Le cœur se remplit quand la documentation est en favori
- L'état est sauvegardé automatiquement

#### API Endpoints
```typescript
// Vérifier si une documentation est en favori
GET /api/favorites/check?userId={userId}&documentationId={docId}

// Ajouter/Retirer des favoris
POST /api/favorites/toggle
Body: {
  userId: string,
  documentationId: string
}
```

### 3. Notes Personnelles

#### Créer une note
1. Cliquez sur "Ajouter une note" dans une étape
2. Ou cliquez sur l'icône 📑 dans l'en-tête
3. Rédigez votre note
4. Choisissez une couleur (jaune, bleu, vert, rouge, violet, orange)
5. Enregistrez

#### Gérer les notes
- **Modifier** : Cliquez sur l'icône ✏️ dans une note
- **Supprimer** : Cliquez sur l'icône 🗑️ dans une note
- **Visualiser** : Panel latéral droit affiche toutes vos notes
- **Navigation** : Cliquez sur une note pour aller à l'étape correspondante

#### API Endpoints
```typescript
// Récupérer les notes d'un utilisateur
GET /api/notes?userId={userId}&documentationId={docId}&stepId={stepId}

// Créer une note
POST /api/notes
Body: {
  userId: string,
  documentationId: string,
  stepId?: string,
  content: string,
  color?: string,
  position?: number
}

// Modifier une note
PUT /api/notes/{noteId}
Body: {
  content?: string,
  color?: string,
  position?: number
}

// Supprimer une note
DELETE /api/notes/{noteId}
```

### 4. Commentaires

#### Ajouter un commentaire
1. Descendez à la section "Commentaires" d'une étape
2. Tapez votre commentaire dans la zone de texte
3. Cliquez sur "Publier"

#### Interagir avec les commentaires
- **Liker** : Cliquez sur l'icône ❤️ d'un commentaire
- **Supprimer** : Seul l'auteur peut supprimer son commentaire (icône 🗑️)
- **Visualiser tous** : Panel latéral droit pour voir tous les commentaires

#### API Endpoints
```typescript
// Récupérer les commentaires
GET /api/comments?documentationId={docId}&stepId={stepId}

// Créer un commentaire
POST /api/comments
Body: {
  userId: string,
  userName: string,
  documentationId: string,
  stepId?: string,
  content: string,
  parentId?: string
}

// Liker un commentaire
POST /api/comments/{commentId}/like

// Supprimer un commentaire
DELETE /api/comments/{commentId}
```

### 5. Affichage du contenu

#### Contenu des étapes
- **Titre** : Titre de l'étape avec badge de numérotation
- **Contenu HTML** : Rendu du contenu riche
- **Images** : Galerie d'images avec prévisualisation
  - Cliquez sur une image pour l'agrandir
  - Navigation entre images dans le mode prévisualisation
- **Outils requis** : Liste des outils nécessaires pour l'étape

#### Panel latéral droit
Affiche soit :
- **Toutes les notes** : Liste de vos notes personnelles
- **Tous les commentaires** : Liste de tous les commentaires publics

## Modèles de données

### Favorite
```typescript
interface IFavorite {
  userId: string;
  documentationId: string;
  createdAt: Date;
}
```

### Note
```typescript
interface INote {
  userId: string;
  documentationId: string;
  stepId?: string;
  content: string;
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple' | 'orange';
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Comment
```typescript
interface IComment {
  userId: string;
  userName: string;
  documentationId: string;
  stepId?: string;
  content: string;
  parentId?: string; // Pour les réponses (à implémenter)
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Interface utilisateur

### En-tête
- Bouton retour vers la liste
- Titre de la documentation
- Boutons d'action :
  - ❤️ Favoris (avec état)
  - 📑 Notes (avec badge de compteur)
  - 💬 Commentaires (avec badge de compteur)
  - ✏️ Mode édition

### Barre des marques
Affiche les marques/brands associées à la documentation

### Contenu principal
- Section contenu riche
- Section images (si présentes)
- Section outils requis (si présents)
- Section notes de l'étape
- Section commentaires de l'étape

## Système d'authentification

⚠️ **Note importante** : Le système utilise actuellement un `userId` généré aléatoirement pour la démonstration.

Pour la production, remplacez :
```typescript
const currentUserId = ref('user-' + Math.random().toString(36).substring(7));
const currentUserName = ref('Utilisateur');
```

Par un vrai système d'authentification qui récupère l'utilisateur connecté.

## Améliorations futures

### Fonctionnalités à ajouter
- [ ] Réponses aux commentaires (système de threading)
- [ ] Recherche dans les notes personnelles
- [ ] Export des notes en PDF/Markdown
- [ ] Notifications pour nouveaux commentaires
- [ ] Mentionner d'autres utilisateurs (@username)
- [ ] Partage de notes entre utilisateurs
- [ ] Tags/catégories pour les notes
- [ ] Navigation au clavier (raccourcis)
- [ ] Mode sombre
- [ ] Impression optimisée
- [ ] Annotations sur les images

### Optimisations
- [ ] Pagination des commentaires
- [ ] Lazy loading des images
- [ ] Cache des favoris/notes
- [ ] Websockets pour les commentaires en temps réel
- [ ] Optimisation SEO

## Structure des fichiers

```
server/
├── models/
│   ├── Favorite.ts       # Modèle Mongoose pour les favoris
│   ├── Note.ts          # Modèle Mongoose pour les notes
│   └── Comment.ts       # Modèle Mongoose pour les commentaires
└── api/
    ├── favorites/
    │   ├── toggle.post.ts    # Toggle favori
    │   └── check.get.ts      # Vérifier favori
    ├── notes/
    │   ├── index.get.ts      # Liste des notes
    │   ├── index.post.ts     # Créer une note
    │   ├── [id].put.ts       # Modifier une note
    │   └── [id].delete.ts    # Supprimer une note
    └── comments/
        ├── index.get.ts      # Liste des commentaires
        ├── index.post.ts     # Créer un commentaire
        ├── [id].delete.ts    # Supprimer un commentaire
        └── [id]/
            └── like.post.ts  # Liker un commentaire

app/
└── pages/
    └── documentation/
        └── read/
            └── [id].vue      # Page de lecture principale
```

## Utilisation

### Depuis le mode édition
Ajoutez un bouton pour passer en mode lecture :
```vue
<Button 
  label="Mode lecture" 
  icon="pi pi-eye" 
  @click="navigateTo(`/documentation/read/${documentationId}`)"
/>
```

### Depuis la liste
Ajoutez un lien vers le mode lecture :
```vue
<router-link :to="`/documentation/read/${doc.id}`">
  Consulter
</router-link>
```

## Exemples d'intégration

### Ajouter un favori depuis le code
```typescript
async function addToFavorites(docId: string) {
  const response = await $fetch('/api/favorites/toggle', {
    method: 'POST',
    body: {
      userId: currentUserId.value,
      documentationId: docId
    }
  });
  
  if (response.success) {
    console.log('Ajouté aux favoris !');
  }
}
```

### Créer une note
```typescript
async function createNote(docId: string, stepId: string, content: string) {
  const response = await $fetch('/api/notes', {
    method: 'POST',
    body: {
      userId: currentUserId.value,
      documentationId: docId,
      stepId: stepId,
      content: content,
      color: 'yellow'
    }
  });
  
  if (response.success) {
    console.log('Note créée !');
  }
}
```

## Support

Pour toute question ou problème, consultez les autres fichiers de documentation :
- `README.md` - Documentation principale
- `ROUTES_INFO.md` - Information sur les routes
- `SEARCH_FEATURE.md` - Fonctionnalité de recherche

