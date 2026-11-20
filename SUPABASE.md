# Brancher ikey. sur Supabase

Ce document explique comment faire tourner **ikey.** sur Supabase : la base de
données PostgreSQL ET le stockage des photos produits. Rien d'autre ne change
— toujours Prisma, toujours le même code, toujours la même connexion admin.

Aucun identifiant réel ne doit jamais être écrit dans le code ou dans ce
dépôt Git. Tout se met dans `server/.env` (fichier ignoré par Git) ou dans
les variables d'environnement de l'hébergeur en production.

---

## Étape 1 — Créer le projet Supabase

1. Aller sur https://supabase.com et cliquer sur **"Start your project"**,
   se connecter (GitHub ou email).
2. Cliquer sur **"New project"**.
3. Choisir :
   - **Name** : `ikey` (ou ce que tu veux, ça n'a pas d'impact technique).
   - **Database Password** : cliquer sur *"Generate a password"*, puis
     **copier ce mot de passe tout de suite dans un endroit sûr**
     (gestionnaire de mots de passe, note chiffrée...). Supabase ne le
     réaffichera plus jamais ensuite. Tu en as besoin pour les étapes
     suivantes.
   - **Region** : il n'y a pas de région en Afrique ni au Moyen-Orient sur
     Supabase. Choisir la plus proche de l'Algérie : **`eu-central-1`
     (Frankfurt)** ou **`eu-west-3` (Paris)**.
4. Cliquer sur **"Create new project"** et attendre 1 à 2 minutes que le
   projet soit provisionné.

## Étape 2 — Récupérer les deux chaînes de connexion (base de données)

Dans le projet Supabase : **Project Settings** (icône engrenage) → **Database**
→ section **Connection string**.

Il y a plusieurs options affichées ; il en faut **deux**, à mettre dans
`server/.env` :

- **`DATABASE_URL`** = celle utilisée par l'application au quotidien.
  Choisir **"Transaction pooler"** (port **6543**). Copier l'URI, remplacer
  `[YOUR-PASSWORD]` par le mot de passe de l'étape 1, et vérifier qu'elle
  contient bien `?pgbouncer=true` à la fin (sinon l'ajouter).
- **`DIRECT_URL`** = celle utilisée uniquement quand on applique les
  migrations Prisma (création/modification des tables). Choisir
  **"Session pooler"** (port **5432**). Même chose : remplacer
  `[YOUR-PASSWORD]` par le vrai mot de passe.

Les deux ressemblent à :

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true   ← DATABASE_URL
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres                  ← DIRECT_URL
```

Coller les deux valeurs dans `server/.env` (créer ce fichier à partir de
`server/.env.example` si ce n'est pas déjà fait).

## Étape 3 — Récupérer l'URL du projet et la clé secrète (pour les photos)

Toujours dans les réglages du projet : **Project Settings** → **API Keys**.

- **Project URL** : affichée en haut de la page (ou dans **Project Settings
  → General**). Ressemble à `https://abcdefghijkl.supabase.co`. À mettre
  dans `SUPABASE_URL`.
- **Secret key** (certains projets plus anciens l'appellent encore
  `service_role` — c'est la même chose) : cliquer sur **"Reveal"** pour
  l'afficher, puis la copier dans `SUPABASE_SECRET_KEY`.

**Cette clé donne un accès complet au projet (base de données et stockage).
Elle ne doit jamais apparaître dans le code, dans le frontend, ni être
partagée. Elle ne va que dans `server/.env` / les variables d'environnement
du serveur.** La clé "publishable" (`anon`) affichée au-dessus n'est pas
utilisée ici — ikey. n'en a pas besoin.

## Étape 4 — Créer le bucket de stockage (photos produits)

Dans le menu de gauche du projet Supabase : **Storage** → **New bucket**.

- **Name** : `product-images` (doit correspondre exactement à
  `SUPABASE_STORAGE_BUCKET` dans `server/.env` — `product-images` est la
  valeur par défaut si la variable n'est pas définie).
- **Public bucket** : **activer** cette option (obligatoire, sinon les
  photos ne seront pas affichables directement sur le site).

Cliquer sur **"Create bucket"**.

## Étape 5 — Compléter `server/.env`

```bash
DATABASE_URL="...."      # Transaction pooler, étape 2
DIRECT_URL="...."        # Session pooler, étape 2
UPLOAD_DRIVER=supabase
SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_SECRET_KEY="...."
SUPABASE_STORAGE_BUCKET="product-images"
```

Pour revenir au stockage local (sur disque) à tout moment, il suffit de
remettre `UPLOAD_DRIVER=local` (ou de supprimer la ligne) — rien d'autre à
changer.

## Étape 6 — Créer les tables sur Supabase

Une fois `DATABASE_URL` et `DIRECT_URL` renseignées :

```bash
npm run prisma:migrate:deploy
```

Cette commande crée toutes les tables (`AdminUser`, `Category`, `Product`,
`ProductImage`, `ProductVariant`, `Order`, `OrderItem`, `Counter`) sur la
base Supabase, sans rien supprimer.

**Seulement si la base est vide** (nouveau projet, aucune donnée) et que tu
veux des données de démonstration :

```bash
npm run prisma:seed
```

Ce script crée aussi le compte admin avec `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` — **penser à changer ces deux valeurs dans
`server/.env` avant de lancer le seed**, sinon le mot de passe par défaut
(`ChangeMe123!`) sera utilisé.

## Étape 7 — Vérifier

```bash
npm run dev
```

- Le site se charge sur http://localhost:5173 et les produits s'affichent
  (preuve que `DATABASE_URL` fonctionne).
- Se connecter sur http://localhost:5173/admin/login et uploader une photo
  sur un produit : l'image doit apparaître immédiatement (preuve que
  `UPLOAD_DRIVER=supabase` fonctionne) et doit être visible dans
  **Storage → product-images** sur le dashboard Supabase.
- Passer une commande test de bout en bout (panier → validation) pour
  vérifier que tout le reste du site fonctionne normalement.

## En cas de données existantes dans une autre base PostgreSQL

Si tu as déjà de vrais produits/commandes dans une autre base (pas celle de
démonstration), **ne pas lancer `prisma:seed`** sur Supabase — demander
d'abord une procédure de migration des données (export/import), à tester
sur une copie avant de toucher à la base réelle. L'ancienne base ne doit
jamais être supprimée tant que les données sur Supabase n'ont pas été
vérifiées (mêmes nombres de catégories, produits, photos, variantes et
commandes).
