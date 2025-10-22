# Docker Configuration

Ce dossier contient la configuration Docker pour l'application Thirdshop Open Documentation.

## 📋 Prérequis

- Docker 20.10+
- Docker Compose 2.0+ (optionnel, mais recommandé)

## 🚀 Utilisation

### Avec Docker Compose (Recommandé)

```bash
# Build et démarrer l'application
docker-compose -f docker/docker-compose.yml up -d

# Voir les logs
docker-compose -f docker/docker-compose.yml logs -f

# Arrêter l'application
docker-compose -f docker/docker-compose.yml down
```

### Avec Docker uniquement

```bash
# Build l'image
docker build -f docker/Dockerfile -t thirdshop-documentation:latest .

# Lancer le conteneur
docker run -d -p 3000:3000 --name thirdshop-documentation thirdshop-documentation:latest

# Voir les logs
docker logs -f thirdshop-documentation

# Arrêter le conteneur
docker stop thirdshop-documentation
docker rm thirdshop-documentation
```

## 🔧 Configuration

### Variables d'environnement

Vous pouvez personnaliser les variables d'environnement dans le fichier `docker-compose.yml` ou les passer directement avec `docker run -e`.

Variables disponibles :
- `NODE_ENV` : Environnement Node.js (production par défaut)
- `HOST` : Hôte d'écoute (0.0.0.0 par défaut)
- `PORT` : Port d'écoute (3000 par défaut)

### Personnalisation du port

Pour changer le port exposé, modifiez la section `ports` dans `docker-compose.yml` :

```yaml
ports:
  - "8080:3000"  # Expose l'application sur le port 8080
```

## 📦 Structure du Dockerfile

Le Dockerfile utilise une approche multi-stage pour optimiser la taille de l'image finale :

1. **Stage deps** : Installation des dépendances
2. **Stage builder** : Build de l'application Nuxt
3. **Stage runner** : Image finale légère avec uniquement les fichiers nécessaires en production

## 🔍 Healthcheck

Un healthcheck est configuré dans le docker-compose pour vérifier que l'application répond correctement :
- Intervalle : toutes les 30 secondes
- Timeout : 10 secondes
- Retries : 3 tentatives
- Start period : 40 secondes au démarrage

## 🛠️ Développement

Pour le développement, il est recommandé d'utiliser `npm run dev` directement plutôt que Docker.

Si vous souhaitez utiliser Docker pour le développement, vous pouvez créer un `Dockerfile.dev` avec hot-reload :

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## 📝 Notes

- L'image finale est basée sur `node:22-alpine` pour une taille minimale
- Les fichiers `.dockerignore` filtrent les fichiers inutiles lors du build
- L'application est accessible sur `http://localhost:3000` par défaut

