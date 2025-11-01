# Configuration MongoDB Atlas

Ce guide vous explique comment configurer MongoDB Atlas pour votre application de documentation.

## 1. Créer un compte MongoDB Atlas

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un compte gratuit (Free Tier - M0)
3. Créez un nouveau cluster

## 2. Configuration du Cluster

### Créer une base de données
1. Dans votre cluster, cliquez sur "Browse Collections"
2. Cliquez sur "Add My Own Data"
3. Nom de la base de données : `open-documentation`
4. Nom de la collection : `documentations`

### Créer un utilisateur
1. Allez dans "Database Access"
2. Cliquez sur "Add New Database User"
3. Choisissez "Password" comme méthode d'authentification
4. Créez un nom d'utilisateur et un mot de passe sécurisé
5. Définissez les privilèges : "Read and write to any database"
6. Cliquez sur "Add User"

### Configurer l'accès réseau
1. Allez dans "Network Access"
2. Cliquez sur "Add IP Address"
3. Pour le développement, vous pouvez ajouter `0.0.0.0/0` (permet tous les IPs)
   - ⚠️ En production, limitez aux IPs spécifiques de votre serveur
4. Cliquez sur "Confirm"

## 3. Obtenir votre URI de connexion

1. Retournez sur votre cluster
2. Cliquez sur "Connect"
3. Choisissez "Connect your application"
4. Sélectionnez "Node.js" comme driver et la version appropriée
5. Copiez l'URI de connexion qui ressemble à :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 4. Configuration de votre application

### Créer un fichier .env

Créez un fichier `.env` à la racine de votre projet (copiez `.env.example`) :

```bash
MONGODB_URI=mongodb+srv://votre-username:votre-password@votre-cluster.mongodb.net/open-documentation?retryWrites=true&w=majority
```

**Important :**
- Remplacez `<username>` par votre nom d'utilisateur MongoDB
- Remplacez `<password>` par votre mot de passe MongoDB
- Assurez-vous que le nom de la base de données est bien `open-documentation`
- ⚠️ Ne commitez JAMAIS ce fichier `.env` dans Git (il est déjà dans `.gitignore`)

### Exemple d'URI complet

```
mongodb+srv://monuser:MonMotDePasse123@cluster0.abc123.mongodb.net/open-documentation?retryWrites=true&w=majority
```

## 5. Démarrer l'application

```bash
npm run dev
```

L'application se connectera automatiquement à MongoDB Atlas au démarrage.

## 6. APIs disponibles

### Créer/Mettre à jour une documentation
```http
POST /api/documentation
Content-Type: application/json

{
  "id": "uuid-optionnel",
  "content": "Contenu de la documentation",
  "order": 0,
  "title": "Titre de la documentation",
  "tools": [{ "name": "Vue.js" }],
  "pictures": [],
  "children": []
}
```

### Récupérer toutes les documentations
```http
GET /api/documentation?limit=50&skip=0&sortBy=createdAt&order=desc
```

### Récupérer une documentation spécifique
```http
GET /api/documentation?id=votre-uuid
```

### Rechercher dans les documentations
```http
GET /api/documentation/search?q=recherche&limit=20
```

### Supprimer une documentation
```http
DELETE /api/documentation/votre-uuid
```

## 7. Vérification

Pour vérifier que tout fonctionne :

1. Démarrez votre application : `npm run dev`
2. Vérifiez les logs de console pour voir : "Connected to MongoDB Atlas"
3. Créez une documentation via l'API POST
4. Vérifiez dans MongoDB Atlas > Collections que la donnée est bien enregistrée

## Dépannage

### Erreur de connexion
- Vérifiez que votre IP est autorisée dans "Network Access"
- Vérifiez que le username/password sont corrects
- Vérifiez que le nom de la base de données est correct dans l'URI

### Erreur d'authentification
- Assurez-vous que l'utilisateur a les bonnes permissions
- Vérifiez que le mot de passe ne contient pas de caractères spéciaux non encodés
- Si votre mot de passe contient des caractères spéciaux, encodez-les en URL

### Performance
- Utilisez les index définis dans le modèle Documentation
- En production, utilisez un cluster dédié (pas le Free Tier pour de grosses charges)

## Sécurité en production

- ✅ Utilisez des variables d'environnement pour les credentials
- ✅ Limitez l'accès réseau aux IPs de votre serveur
- ✅ Utilisez des mots de passe forts
- ✅ Activez l'authentification à deux facteurs sur votre compte Atlas
- ✅ Configurez des sauvegardes automatiques
- ✅ Surveillez les logs d'activité

