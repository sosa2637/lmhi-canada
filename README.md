# LMHI Canada — projet autonome

Site corporatif bilingue de Longla Marine & Heavy Industries Canada. Cette version fonctionne sans compte ChatGPT et sans le plugin Sites. Le code source est destiné à être modifié dans VS Code, versionné sur GitHub et déployé sur Vercel.

## Démarrage local (Windows, macOS ou Linux)

Prérequis : Node.js 22.13+ (version LTS recommandée), npm et Git. Aucun compte cloud ni Docker n’est nécessaire pour le mode local.

```bash
npm ci
npm run setup
npm run dev
```

Le script demande le courriel de l’administrateur, génère un mot de passe, crée `.env.local`, la base SQLite et les tables. Conservez le mot de passe affiché. Le site est à http://localhost:3000 et l’administration à http://localhost:3000/gestion. `npm run setup` n’écrase jamais une configuration existante.

Pour définir un nouveau mot de passe : `npm run admin:password`, puis recopier la valeur `ADMIN_PASSWORD_HASH` affichée dans `.env.local` et redémarrer le serveur. Le mot de passe n’est pas conservé en clair dans le projet. La modification du hash invalide les sessions existantes.

## Stack

- Next.js App Router, React et TypeScript; runtime Node.js.
- CSS personnalisé, Lucide React.
- SQLite local via libSQL; Turso distant pour Vercel, avec les mêmes migrations SQL.
- Fichiers privés sur disque en local; Vercel Blob privé en production.
- Session administrateur signée avec JOSE, cookie HttpOnly / SameSite strict, mot de passe haché avec scrypt.

## Structure utile

```text
app/                 pages, styles et routes API
components/          site, formulaires et espace de gestion
lib/                 base de données, authentification, stockage, validations
migrations/          migrations SQL numérotées, à conserver immuables une fois appliquées
public/images/       photos du site
scripts/             installation, migrations, mot de passe et nettoyage
tests/              tests automatisés
docs/               déploiement, remise au propriétaire et crédits
```

Les textes initiaux et les divisions se trouvent dans `app/content.ts`. Le CSS est dans `app/globals.css`. Les textes enregistrés dans l’espace de gestion prennent priorité sur les textes initiaux. Pour modifier les sections de page, voir `components/site.tsx`; pour les formulaires, `components/request-form.tsx`; pour la gestion, `components/admin.tsx`.

## Fonctions

Pages FR/EN, six divisions, candidatures, soumissions, propositions de partenariat, pièces jointes privées, publications, offres d’emploi, brochures, associations autorisées et statistiques agrégées sans cookies. Les demandes sont consultables dans `/gestion`; l’envoi de notifications par courriel n’est pas configuré.

Les fichiers (3 maximum, 10 Mo chacun, 15 Mo au total) sont envoyés directement vers Vercel Blob en production. Le formulaire ne transmet ensuite que leurs références à Next.js, pour ne pas faire passer les fichiers volumineux dans les requêtes des fonctions Vercel. La base reste distante et durable : le disque éphémère Vercel n’est jamais utilisé pour les demandes.

## Commandes

| Commande                  | Usage                                                         |
| ------------------------- | ------------------------------------------------------------- |
| `npm run dev`             | Développement local                                           |
| `npm run typecheck`       | Vérification TypeScript                                       |
| `npm test`                | Tests automatisés                                             |
| `npm run build`           | Compilation de production                                     |
| `npm start`               | Démarrer la version compilée                                  |
| `npm run db:migrate`      | Appliquer les migrations à la base de `.env.local`            |
| `npm run admin:password`  | Produire un nouveau hash de mot de passe                      |
| `npm run uploads:cleanup` | Nettoyer les fichiers abandonnés dont l’autorisation a expiré |
| `npm run format`          | Formater le code                                              |

Ne lancez pas les migrations vers une base de production sans sauvegarde. Ne modifiez pas les migrations déjà appliquées; ajoutez un nouveau fichier SQL.

## GitHub et Vercel

Consulter [docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md). Les secrets, données locales, fichiers téléversés, `node_modules` et `.next` sont exclus de Git et de l’archive livrée. Le projet ne contient aucune clé de l’environnement Sites.

```bash
git init
git add .
git commit -m "Initialiser le site LMHI Canada"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/lmhi-canada.git
git push -u origin main
```

Créer d’abord un dépôt GitHub vide et remplacer l’URL. Le dépôt devrait appartenir au propriétaire, ou lui être transféré lors de la remise.

## Statut de livraison

Code source et environnement local prêts à installer. Le raccordement réel à Turso et à Vercel Blob nécessite les comptes et secrets du propriétaire. Le flux cloud doit être testé sur son déploiement de préproduction avant mise en ligne publique. Aucune donnée de l’ancien site Sites n’a été exportée : cette version part avec une base vide et les textes initiaux du projet.

Logo officiel, coordonnées, affiliations, documents, politique de confidentialité définitive et services restent à valider. `SITE_INDEXABLE=false` empêche l’indexation pendant cette étape; la protection contre les accès publics se règle séparément dans Vercel. Les photos sont illustratives, elles ne représentent pas des réalisations LMHI.

## Mise à jour des informations LMHI — 2 octobre 2026

Présentation recentrée sur le soudage industriel, la fabrication métallique et la maintenance; implantation dans la ville de Québec. Président-fondateur : **Joe Pharleys Longla Pafoule**. Téléphone : **(581) 994-6819**. Courriel public : **longlajoe@gmail.com**. Les versions FR/EN sont incluses. Les informations initiales sont centralisées dans `defaultSettings` dans `app/content.ts` et peuvent être ajustées dans l’administration. Les valeurs déjà enregistrées manuellement dans votre base gardent priorité : mettez-les à jour dans « Textes & coordonnées » si nécessaire. Aucun changement aux identifiants de connexion administrateur.
