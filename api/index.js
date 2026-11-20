// Point d'entrée Vercel : l'API Express tourne comme fonction serverless,
// sur le même domaine que le site (les cookies admin restent "first-party").
// server/server.js reste l'entrée pour cPanel / un hébergement classique.
module.exports = require('../server/src/app');
