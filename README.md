# CEM Pulse

Prototype interactif en français d’une plateforme de veille marketing. Node.js 24 ou supérieur, aucune dépendance à installer.

## Démarrage

```sh
npm start
```

Le serveur écoute sur le port 3000 (surcharge possible via `PORT`).

## Fonctionnalités

Dashboard responsive, recherche et filtres combinables, analyses éditoriales, sélection de favoris, préférences d’alerte persistantes en local, synthèses quotidienne et hebdomadaire et export texte, répertoire de sources officielles.

## Limites explicites

Les huit tendances et leurs scores sont illustratifs. Le dashboard initial n’a aucune mesure en temps réel ni génération IA. La rubrique Meta peut collecter les publications de comptes autorisés après configuration ; elle ne constitue pas un classement global des tendances. Il n’y a ni authentification utilisateur ni notification envoyée. Les liens renvoient aux publications officielles, sans prétendre sourcer une actualité précise. Les favoris et préférences restent dans le navigateur et ne sont pas synchronisés.

Pour une version de production : prévoir un backend, une base de données, une collecte autorisée par chaque source, une traçabilité par article et date, un fournisseur IA et un service de notification. Ne pas scraper les réseaux sociaux sans vérifier leurs conditions et autorisations.

## Vérification

```sh
node --check app.js
node --check server.mjs
npm start
# Dans un second terminal :
curl --fail http://127.0.0.1:3000/
```

## Posts & Reels Meta — configuration serveur

La rubrique « Posts & Reels Meta » consulte `/api/meta/feed`. Sans configuration, elle ne montre aucune fausse publication. Une fois connectée : jusqu’à 50 publications récentes par compte, cache serveur de cinq minutes, actualisation toutes les cinq minutes lorsque la rubrique est visible. Tri par date ou somme des interactions disponibles (ce n’est pas un score de tendance). Les nouveaux éléments depuis la première collecte sont signalés jusqu’au marquage comme vus. La collecte n’archive pas l’historique et ne récupère pas toutes les pages de résultats.

Variables à configurer **côté serveur**, jamais dans le navigateur ou dans Git :

- `META_ACCESS_TOKEN` : jeton Meta autorisé pour les ressources demandées. À saisir uniquement dans les paramètres sécurisés de l’hébergement. Aucun mot de passe personnel.
- `META_IG_USER_ID` : identifiant numérique du compte Instagram professionnel lié à la connexion Facebook Login.
- `META_PAGE_ID` : identifiant numérique de la Page Facebook autorisée.
- `META_GRAPH_VERSION` : version Graph API, par défaut `v23.0`. Vérifier la version et les permissions dans le tableau de bord de votre application Meta.

Au moins un identifiant est nécessaire. Un jeton doit disposer des droits correspondants à chaque ressource configurée ; si un même jeton ne permet pas les deux, ne connecter que la source autorisée. Une connexion Facebook Login, les permissions adaptées et éventuellement une validation de l’application Meta sont nécessaires. Les publications Facebook sont étiquetées « Post » : ce connecteur ne détecte pas spécifiquement leurs Reels. Les Reels Instagram sont identifiés via `media_product_type`.

Documentation : [Instagram API avec Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/) et [Pages API](https://developers.facebook.com/docs/pages-api/).

Le serveur utilise le proxy hérité via Node.js 24 `--use-env-proxy`. Dans l’environnement cloud restreint, autoriser `graph.facebook.com`. Les secrets proxy doivent être liés à ce domaine. Ne pas désactiver TLS. Ne pas publier le serveur avec des données confidentielles : cette démo n’a pas de contrôle d’accès utilisateur.

Les tests `npm test` couvrent la configuration absente, la normalisation des Reels, les liens rejetés, les erreurs d’accès, le fonctionnement partiel et le cache. Ils utilisent des réponses simulées ; une connexion Meta réelle reste à valider après ajout des accès.
