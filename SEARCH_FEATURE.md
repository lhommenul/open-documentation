# Fonctionnalité de Recherche

## Vue d'ensemble

La nouvelle page de recherche permet aux utilisateurs de trouver rapidement leurs documentations techniques avec des fonctionnalités avancées de recherche et de filtrage.

## Fichiers créés/modifiés

### Nouveaux fichiers

1. **`app/pages/documentation/search.vue`**
   - Page principale de recherche
   - Intègre le composant SearchBar
   - Affiche les résultats en grille ou en liste
   - Gère le tri et le filtrage des résultats

2. **`app/components/DocumentationCard.vue`**
   - Composant pour afficher une documentation en format carte
   - Vue grille pour les résultats de recherche
   - Affiche les métadonnées (étapes, outils, images)
   - Actions rapides (voir, éditer, supprimer)

3. **`app/components/DocumentationListItem.vue`**
   - Composant pour afficher une documentation en format liste
   - Vue liste détaillée pour les résultats
   - Mise en évidence du texte recherché
   - Affichage des outils sous forme de tags

### Fichiers modifiés

1. **`app/components/SearchBar.vue`**
   - Remplacement des données mockées par de vraies données de l'API
   - Intégration avec `/api/documentation/search`
   - Chargement dynamique des marques et outils disponibles
   - Suggestions en temps réel pendant la saisie

## Fonctionnalités

### 1. Recherche en temps réel
- Suggestions automatiques pendant la saisie
- Recherche dans le titre, contenu, marques et outils
- Score de pertinence pour chaque résultat
- Indication du type de correspondance (titre, contenu, marque, outil)

### 2. Filtres avancés
- **Marques** : Filtre par marques (chargées dynamiquement)
- **Outils** : Filtre par outils (chargés dynamiquement)
- **Période** : Aujourd'hui, Cette semaine, Ce mois, Cette année
- **Tri** : Pertinence, Plus récent, Plus ancien, Titre (A-Z), Titre (Z-A)

### 3. Affichage des résultats
- **Mode grille** : Cartes visuelles avec métadonnées
- **Mode liste** : Liste détaillée avec mise en évidence du texte
- Compteur de résultats
- Actions rapides sur chaque résultat

### 4. Historique de recherche
- Sauvegarde des recherches récentes dans localStorage
- Accès rapide aux 5 dernières recherches
- Possibilité d'effacer l'historique

### 5. Actions rapides
- Création de documentation depuis la recherche
- Navigation vers la vue détaillée
- Édition directe
- Suppression avec confirmation

## API utilisée

### Endpoint de recherche
```
GET /api/documentation/search?q={query}&limit={limit}
```

**Paramètres :**
- `q` (required) : Terme de recherche
- `limit` (optional) : Nombre maximum de résultats (défaut: 20)

**Réponse :**
```json
{
  "success": true,
  "query": "iPhone",
  "results": 2,
  "data": [
    {
      "_id": "...",
      "title": "iPhone 15 Pro - Guide",
      "content": "Documentation complète...",
      "brands": ["Apple"],
      "tools": [{ "name": "Tournevis" }],
      "pictures": [...],
      "children": [...],
      "createdAt": "2025-11-02T...",
      "updatedAt": "2025-11-02T..."
    }
  ]
}
```

### Endpoint de liste
```
GET /api/documentation?limit={limit}&skip={skip}&sortBy={field}&order={asc|desc}
```

Utilisé pour charger les marques et outils disponibles.

## Navigation

Pour accéder à la page de recherche :
- URL : `/documentation/search`
- Depuis la liste : Bouton "Rechercher" dans l'en-tête
- Depuis n'importe où : Navigation directe

## Composants utilisés

### PrimeVue
- `Button` : Boutons d'action
- `InputText` : Champ de recherche
- `Select` : Sélecteurs de tri et de filtres
- `MultiSelect` : Sélection multiple pour les filtres
- `SelectButton` : Choix du mode d'affichage
- `Badge` : Compteurs et badges
- `Chip` : Tags pour les filtres actifs et les outils
- `Dialog` : Confirmation de suppression
- `Toast` : Notifications

### VueUse
- `useDebounceFn` : Debounce pour la recherche en temps réel
- `onClickOutside` : Fermeture des suggestions au clic extérieur

## Améliorations futures possibles

1. **Recherche avancée**
   - Opérateurs de recherche (AND, OR, NOT)
   - Recherche par plage de dates
   - Recherche par nombre d'étapes/outils

2. **Performance**
   - Pagination des résultats
   - Cache des recherches fréquentes
   - Lazy loading des images

3. **UX**
   - Raccourcis clavier (Ctrl+K pour ouvrir la recherche)
   - Sauvegarde des filtres préférés
   - Export des résultats de recherche

4. **Endpoint dédié**
   - Créer `/api/filters` pour récupérer les marques et outils
   - Éviter de charger toutes les documentations pour extraire les filtres

## Notes techniques

- La recherche utilise l'index de texte intégral MongoDB (`$text`)
- Les suggestions sont limitées à 10 résultats
- Les filtres sont appliqués côté client après la recherche
- L'historique est stocké dans localStorage (max 5 recherches)

## Tests recommandés

1. Rechercher avec différents termes
2. Tester les filtres individuellement et combinés
3. Vérifier la navigation entre les modes grille/liste
4. Tester les actions (voir, éditer, supprimer)
5. Vérifier l'historique de recherche
6. Tester sur mobile et desktop

