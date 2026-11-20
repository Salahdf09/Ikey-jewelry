// Point d'entrée pour Vercel (Vercel Functions) : réutilise l'app Express
// telle quelle, sans app.listen() (Vercel gère lui-même l'écoute réseau).
// server/server.js reste l'entrée utilisée pour cPanel/un hébergement
// classique — ce fichier ne remplace rien, il s'ajoute à côté.
module.exports = require('../src/app');
