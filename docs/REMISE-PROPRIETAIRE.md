# Remise de LMHI Canada au propriétaire

Livrer le dépôt GitHub complet, le README, ce guide et un accès administrateur fonctionnel. Le propriétaire doit détenir ou contrôler : le dépôt GitHub, le projet Vercel, la base Turso, le magasin Blob privé et le compte du registraire du domaine.

1. Faire valider l’apparence, les textes FR/EN, les services, le logo, les coordonnées, les affiliations et les documents.
2. Faire choisir au propriétaire son courriel et son mot de passe d’administration. Générer le hash sans envoyer le mot de passe dans le dépôt ou dans une conversation publique.
3. Transmettre les secrets via un gestionnaire de mots de passe, puis renouveler les jetons utilisés par le développeur. Remplacer `SESSION_SECRET` déconnecte les sessions existantes.
4. Montrer l’ajout d’un poste, la lecture d’une candidature, le téléchargement d’un CV, la modification d’un texte, une publication et une brochure.
5. Définir avec lui les personnes autorisées, la durée de conservation des candidatures et demandes, la fréquence des sauvegardes et les modalités de suppression. La page de confidentialité provisoire doit être finalisée avec ces informations.
6. Documenter les contrats d’hébergement, les quotas, les moyens de paiement et la personne responsable de la maintenance.
7. Retirer les accès développeur qui ne sont plus nécessaires après réception.

## Sauvegardes

En local, sauvegarder `data/lmhi.db` et `data/uploads/` avec le serveur arrêté, ainsi que `.env.local` dans un coffre séparé. En production, utiliser les fonctions de sauvegarde/export Turso et exporter séparément les objets Blob privés. Tester la restauration dans une base séparée. Le dépôt Git contient le code et les migrations, pas les données envoyées par les visiteurs.

## Points encore à fournir

Nom confirmé : Joe Pharleys Longla Pafoule, président-fondateur. Téléphone fourni : (581) 994-6819. Courriel fourni : longlajoe@gmail.com. Implantation : ville de Québec, Canada. Ces coordonnées publiques ne changent pas les identifiants d’administration.

Restent à fournir : logo officiel haute résolution, adresse administrative complète, lien LinkedIn, autorisations d’affiliation et d’utilisation des logos et documents publiables. La connexion d’administration est indépendante de ChatGPT. Les courriels automatiques ne sont pas implémentés. La version publique doit être activée seulement après validation.

## Ancienne version Sites

Cette archive est une nouvelle version autonome. Elle ne modifie ni ne supprime l’ancien site privé. Les demandes et contenus éventuellement enregistrés dans l’ancien site ne sont pas migrés automatiquement; prévoir un export autorisé avant de l’abandonner si des données y ont été saisies.
