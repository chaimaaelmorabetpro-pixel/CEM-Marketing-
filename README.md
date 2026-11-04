# CEM Pulse

Prototype interactif en français d’une plateforme de veille marketing. Node.js 22 ou supérieur, aucune dépendance à installer.

## Démarrage

```sh
npm start
```

Le serveur écoute sur le port 3000 (surcharge possible via `PORT`).

## Fonctionnalités

Dashboard responsive, recherche et filtres combinables, analyses éditoriales, sélection de favoris, préférences d’alerte persistantes en local, synthèses quotidienne et hebdomadaire et export texte, répertoire de sources officielles.

## Limites explicites

Les huit tendances et leurs scores sont illustratifs. Il n’y a aucune collecte automatique, mesure en temps réel, génération IA, authentification ou notification envoyée. Les liens renvoient aux publications officielles, sans prétendre sourcer une actualité précise. Les favoris et préférences restent dans le navigateur et ne sont pas synchronisés.

Pour une version de production : prévoir un backend, une base de données, une collecte autorisée par chaque source, une traçabilité par article et date, un fournisseur IA et un service de notification. Ne pas scraper les réseaux sociaux sans vérifier leurs conditions et autorisations.

## Vérification

```sh
node --check app.js
node --check server.mjs
npm start
# Dans un second terminal :
curl --fail http://127.0.0.1:3000/
```
