# Déployer sur Vercel

## 1. Comptes et responsabilités

Créer ou utiliser les comptes GitHub, Vercel et Turso du propriétaire. Vous pouvez recevoir un accès collaborateur; ne lui livrez pas un projet dépendant de vos comptes personnels. Les coûts et quotas sont à vérifier directement dans les interfaces des fournisseurs au moment du déploiement.

## 2. Base distante

Créer une base Turso (libSQL) et un jeton d’accès. Copier temporairement son URL `libsql://…` et son jeton dans une copie locale protégée de `.env.local`, puis exécuter `npm run db:migrate`. Cette commande applique les migrations manquantes et refuse une migration appliquée dont le contenu a changé. Restaurer ensuite les valeurs locales si vous souhaitez continuer à travailler hors ligne.

Configurer les mêmes `DATABASE_URL` et `DATABASE_AUTH_TOKEN` dans Vercel. Ne mettre aucun secret dans une variable `NEXT_PUBLIC_*`. Vercel ne peut pas conserver une base `file:` entre les exécutions.

## 3. Stockage des fichiers

Créer un magasin **Vercel Blob privé**, lié au projet. Configurer `BLOB_READ_WRITE_TOKEN` et `STORAGE_DRIVER=vercel`. Ce jeton est requis par le flux de téléversement direct du navigateur; il reste exclusivement côté serveur. Les tokens de téléversement donnés au navigateur sont limités à un chemin et une taille.

Les CV et plans sont servis par `/api/files` après vérification de la session administrateur. Les brochures ne deviennent téléchargeables publiquement qu’après enregistrement dans les paramètres du site. Les autorisations d’upload expirent après une heure. Exécuter périodiquement le nettoyage des uploads abandonnés depuis un environnement de maintenance ayant accès aux variables de production; le script préserve les brochures référencées.

## 4. Importer le dépôt

Dans Vercel : Add New → Project → sélectionner le dépôt GitHub → framework Next.js. Garder les commandes npm standards : installation `npm ci`, build `npm run build`. Le fichier de verrouillage est fourni. Sélectionner Node.js 22 ou une version ultérieure compatible.

Variables serveur à configurer :

| Variable | Valeur |
| --- | --- |
| `DATABASE_URL` | URL Turso distante |
| `DATABASE_AUTH_TOKEN` | Jeton Turso |
| `STORAGE_DRIVER` | `vercel` |
| `BLOB_READ_WRITE_TOKEN` | Jeton du magasin privé |
| `ADMIN_EMAIL` | Courriel choisi pour la connexion propriétaire |
| `ADMIN_PASSWORD_HASH` | Généré avec `npm run admin:password` |
| `SESSION_SECRET` | Secret aléatoire d’au moins 32 caractères |
| `FORM_SECRET` | Autre secret aléatoire d’au moins 32 caractères |
| `APP_URL` | Origine HTTPS exacte du site, sans chemin |
| `SITE_INDEXABLE` | `false` avant validation, puis `true` |

Générer chaque secret avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Utiliser des valeurs différentes entre développement, préproduction et production. Après changement de variables, redéployer.

Pour les aperçus Vercel, l’origine `VERCEL_URL` est également acceptée par la protection des formulaires. Les aperçus doivent idéalement disposer d’une base et d’un magasin séparés pour éviter les données de test dans la production.

## 5. Vérification avant lancement

- Connexion et déconnexion propriétaire; accès refusé aux demandes sans session.
- Une demande de chaque type et son affichage dans `/gestion`.
- CV PDF et image, puis fichier de plus de 4,5 Mo : le téléversement direct doit fonctionner.
- Refus d’un type interdit, d’un fichier dépassant 10 Mo, de plus de 3 fichiers ou de plus de 15 Mo au total.
- Téléchargement privé, suppression du dossier et des fichiers.
- Ajout d’un poste, d’une actualité et d’une brochure, en français et en anglais.
- Contrôle visuel sur mobile et ordinateur.
- Texte de confidentialité, coordonnées, services réglementés et droit d’utilisation des marques validés par le propriétaire.

## 6. Domaine

Ajouter `longlamarine.com` et éventuellement `www.longlamarine.com` dans les réglages Domains du projet Vercel. Reproduire chez le gestionnaire du domaine les enregistrements DNS exacts indiqués par Vercel; ne pas inventer d’adresse IP. Préserver les enregistrements MX/TXT utilisés pour le courriel. Choisir le domaine principal et mettre à jour `APP_URL`.

Activer l’indexation avec `SITE_INDEXABLE=true` seulement après validation finale. Les notifications par courriel restent une intégration séparée : aucune confirmation d’envoi n’est simulée.

Sources techniques : https://vercel.com/docs/vercel-blob/client-upload ; https://vercel.com/docs/vercel-blob/using-blob-sdk ; https://docs.turso.tech/sdk/ts/reference ; https://nextjs.org/docs/app/guides/authentication
