# ikey. — boutique de bijoux faits main

Boutique e-commerce complète pour **ikey.**, marque de bijoux faits main. Paiement **à la livraison uniquement** (Algérie). Aucune création de compte n'est nécessaire pour commander.

- Frontend : React 18 + Vite + Tailwind CSS
- Backend : Node.js + Express
- Base de données : PostgreSQL via Prisma ORM
- Emails : Nodemailer (notification de commande à la boutique)

---

## 1. Architecture

```
/ikey
  package.json          # scripts racine (workspaces npm : client + server)
  prisma/
    schema.prisma        # source unique du schéma de base de données
    seed.js               # jeu de données de démonstration
  client/                 # storefront + back-office (React/Vite)
    src/
      components/         # UI réutilisable (layout, product, cart, checkout, admin, home)
      pages/               # une page par route (+ pages/admin)
      layouts/             # StorefrontLayout (boutique) / AdminLayout (back-office)
      hooks/               # useAdminAuth (session admin)
      services/            # appels API (axios)
      store/               # panier (zustand + localStorage)
      utils/               # devise, wilayas, frais de livraison (aperçu)
  server/
    server.js             # point d'entrée (dev ET déploiement cPanel)
    src/
      app.js               # configuration Express (middlewares + routes)
      config/              # env, prisma client, mailer
      controllers/         # logique par ressource
      routes/               # définition des endpoints REST
      middleware/           # auth, erreurs, rate-limit, validation
      services/             # commandes (prix/stock), email, images
      validators/            # règles express-validator
      templates/             # template HTML de l'email de commande
    uploads/               # images produits (stockage local, dev)
```

Le serveur Express (`server/server.js`) est **à la fois** l'API et — en production — le serveur qui sert le build du storefront (`client/dist`), avec un fallback SPA. Un seul process Node suffit donc en production (voir §7, déploiement cPanel).

---

## 2. Schéma de base de données (Prisma)

Modèles : `AdminUser`, `Category`, `Product`, `ProductImage`, `ProductVariant`, `Order`, `OrderItem`, `Counter` (compteur atomique pour les numéros de commande `ORD-2026-000123`).

Points clés :
- Les prix sont stockés en entiers (DA, pas de centimes).
- `OrderItem` conserve un **instantané** du nom produit, nom de variante et prix unitaire au moment de la commande — l'historique des commandes reste correct même si le produit est modifié ou supprimé après coup.
- `Product.trackStock` permet de désactiver le suivi de stock pour un produit donné (le stock affiche alors `∞` côté admin).
- Suppression d'un produit ayant des commandes associées : bloquée (erreur 409 explicite) — désactiver le produit à la place.

---

## 3. Variables d'environnement

### `server/.env` (copier `server/.env.example`)

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL Prisma |
| `PORT` | Port du serveur (5000 en dev) |
| `NODE_ENV` | `development` / `production` |
| `CLIENT_URL` | Origine(s) autorisée(s) en CORS (liste séparée par des virgules) |
| `JWT_SECRET` | Secret de signature des sessions admin (générer une valeur longue et aléatoire) |
| `COOKIE_NAME` | Nom du cookie de session admin |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` | Configuration SMTP (Nodemailer) |
| `STORE_EMAIL` | Adresse qui reçoit la notification de nouvelle commande |
| `MAIL_FROM_NAME` / `MAIL_FROM_ADDRESS` | Expéditeur affiché sur les emails sortants |
| `UPLOAD_DRIVER` | `local` (défaut) — voir §8 |
| `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Identifiants du compte admin créé par `prisma:seed` |

### `client/.env` (copier `client/.env.example`, optionnel en dev)

| Variable | Rôle |
|---|---|
| `VITE_API_URL` | URL de base de l'API. Vide par défaut → utilise `/api` (fonctionne avec le proxy Vite en dev, et nativement en production puisque le serveur unique sert l'API et le frontend sur la même origine). À définir uniquement si le frontend est déployé séparément du backend. |

---

## 4. Installation locale

Prérequis : Node.js 18+, un serveur PostgreSQL accessible.

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Renseigner `DATABASE_URL` et les identifiants SMTP dans `server/.env`, puis :

```bash
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

- `npm run prisma:migrate` crée les tables (Prisma Migrate).
- `npm run prisma:seed` crée les 4 catégories, 8 produits de démonstration et le compte admin défini par `SEED_ADMIN_*` (par défaut `admin@ikey-store.com` / `ChangeMe123!` — **à changer avant toute mise en production**).
- `npm run dev` lance le backend (port 5000) et le frontend (port 5173, proxy `/api` → 5000) en parallèle.

Storefront : http://localhost:5173
Back-office : http://localhost:5173/admin/login

### Scripts npm utiles (racine)

| Script | Effet |
|---|---|
| `npm run dev` | Backend + frontend en parallèle (dev) |
| `npm run build` | Build de production du frontend (`client/dist`) |
| `npm start` | Démarre le serveur unique de production (`node server/server.js`) |
| `npm run prisma:generate` | Régénère le client Prisma |
| `npm run prisma:migrate` | Applique les migrations (dev) |
| `npm run prisma:migrate:deploy` | Applique les migrations (production, non-interactif) |
| `npm run prisma:seed` | Rejoue le script de seed |
| `npm run prisma:studio` | Ouvre Prisma Studio |

---

## 5. Le compte admin

Créé par le seed à partir de `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (mot de passe hashé avec bcrypt, jamais stocké en clair). Pour le changer :

- **Avant le premier seed** : modifier `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` dans `server/.env` puis lancer `npm run prisma:seed`.
- **Après coup** : soit via Prisma Studio (`npm run prisma:studio`, éditer `admin_users` — le mot de passe doit rester un hash bcrypt), soit en écrivant un petit script one-off qui appelle `bcrypt.hash()` puis `prisma.adminUser.update(...)`.

Il n'existe volontairement aucune route pour créer un admin depuis l'interface — c'est un choix de sécurité, pas une contrainte technique.

---

## 6. Configuration des emails

Nodemailer envoie une notification HTML à `STORE_EMAIL` à chaque nouvelle commande (template `server/src/templates/orderEmail.js`, aux couleurs de la marque). L'envoi échoue silencieusement côté client — la commande est déjà enregistrée avant l'envoi, un email en échec n'annule jamais une commande (l'erreur est seulement journalisée côté serveur).

Pour Gmail : utiliser un [mot de passe d'application](https://support.google.com/accounts/answer/185833), pas le mot de passe du compte. Pour tester sans SMTP réel, [ethereal.email](https://ethereal.email) fournit des identifiants jetables valables pour le développement.

---

## 7. Déploiement

Le frontend et le backend peuvent être déployés ensemble (un seul process Node) ou séparément.

### Option A — cPanel / hébergement mutualisé (un seul process Node)

1. Construire le frontend : `npm run build` (génère `client/dist`).
2. Dans le sélecteur d'application Node.js de cPanel :
   - **Application root** : la racine du dépôt (ce dossier).
   - **Application startup file** : `server/server.js`.
   - Renseigner les variables d'environnement (§3) dans l'interface cPanel, ou déposer un `server/.env`.
3. cPanel exécute `npm install` à la racine (le `postinstall` régénère automatiquement le client Prisma).
4. Lancer les migrations en production : `npm run prisma:migrate:deploy`, puis `npm run prisma:seed` (une seule fois).
5. Démarrer/redémarrer l'application. `server/server.js` sert alors `client/dist` **et** l'API `/api/*` depuis le même process et le même port (celui fourni par cPanel via `PORT`).

### Option B — Frontend et backend séparés

- Backend : déployer `/server` (+ `/prisma`) sur tout hébergeur Node (Railway, Render, VPS...), avec une base PostgreSQL accessible.
- Frontend : déployer `client/dist` sur un hébergeur statique (Netlify, Vercel, etc.), en définissant `VITE_API_URL` vers l'URL publique du backend.
- Mettre à jour `CLIENT_URL` côté serveur pour autoriser l'origine du frontend en CORS.

Dans les deux cas : ne jamais committer de fichier `.env` réel (seuls les `.env.example` sont versionnés).

---

## 8. Stockage des images

En développement, `UPLOAD_DRIVER=local` enregistre les images uploadées depuis le back-office dans `server/uploads/` et les sert sous `/uploads/...`. Cette logique est isolée dans `server/src/services/image.service.js` derrière une petite interface (`storage`, `getUrl`, `deleteFile`) : pour migrer vers S3, Cloudinary ou équivalent, il suffit d'implémenter ces trois éléments pour ce nouveau driver et de changer `UPLOAD_DRIVER` — aucun autre fichier n'a besoin d'être modifié.

---

## 9. Sécurité

- Mots de passe admin hashés (bcrypt), jamais renvoyés par l'API.
- Session admin en cookie **httpOnly** (JWT), jamais accessible en JavaScript côté client.
- `helmet`, CORS restreint à `CLIENT_URL`, rate-limiting (API générale, création de commande, login admin).
- Toutes les routes `/api/admin/*` (hors `/login`) passent par le middleware `requireAdmin`.
- Le prix et le total d'une commande sont **toujours** recalculés côté serveur à partir de la base de données — les valeurs envoyées par le client ne sont jamais utilisées pour le calcul final.
- Le message d'erreur de connexion admin est identique que l'email existe ou non (pas d'énumération de comptes).
- Les erreurs serveur (500) ne renvoient jamais de stack trace ni de détail interne en production.

---

## 10. Vérifications effectuées

Parcours testés de bout en bout pendant le développement :

- **Client** : accueil → liste produits (filtre catégorie/recherche) → détail produit (variantes, quantité) → panier → checkout → commande créée en base → email de notification envoyé → page de confirmation.
- **Admin** : connexion → tableau de bord (statistiques réelles) → création produit → modification du prix → vérification de la mise à jour immédiate côté storefront → consultation d'une commande → changement de statut → déconnexion → accès direct à une page admin sans session (redirection vers `/admin/login`).
- Build de production (`npm run build` + `NODE_ENV=production node server/server.js`) : fichiers statiques, fallback SPA et API confirmés fonctionnels sur un seul process/port.

Deux bugs réels ont été trouvés et corrigés pendant ces tests :
1. **Course critique au checkout** : vider le panier avant de naviguer vers la page de confirmation pouvait déclencher la redirection "panier vide" de la page de checkout avant que la navigation n'ait lieu. Le panier est désormais vidé depuis la page de confirmation elle-même, une fois la commande déjà affichée.
2. **Menu mobile mal positionné** : le menu mobile était rendu à l'intérieur du `<header>`, dont le fond flouté (`backdrop-blur`) créait involontairement un nouveau contexte de positionnement pour ses éléments `fixed`, réduisant le panneau à la hauteur de la barre de navigation. Le menu est maintenant un frère du `<header>`, plus un enfant.

---

## 11. Ce qui reste volontairement simple

- Le frais de livraison est un tarif forfaitaire par wilaya (Alger vs reste du pays) — facile à affiner dans `server/src/utils/wilayas.js` si besoin de tarifs plus précis.
- Pas de recherche plein texte avancée (PostgreSQL `ILIKE` simple) — suffisant pour un catalogue de cette taille.
- Le graphique du tableau de bord est un rendu maison léger (pas de librairie de charting) pour rester simple et rapide.
