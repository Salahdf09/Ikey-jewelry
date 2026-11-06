// Application entry point.
//
// Used for local dev ("npm run dev" / "npm start") and as the cPanel
// Node.js Selector "Application startup file" in production:
//   Application root:     the repo root (this file lives at <root>/server/server.js)
//   Startup file:          server/server.js
//
// In production this single process also serves the built storefront
// (client/dist) so the whole site runs behind one cPanel Node app.
const path = require('path');
const fs = require('fs');
const express = require('express');

const env = require('./src/config/env');
const app = require('./src/app');
const { errorHandler } = require('./src/middleware/error.middleware');

if (env.isProduction) {
  const clientDist = path.resolve(__dirname, '../client/dist');

  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    // SPA fallback: anything that isn't /api or /uploads renders the app shell.
    app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[server] client build not found at ${clientDist} — run "npm run build" first.`);
  }
}

// Registered last of all, after any static/SPA middleware above, so it
// catches errors from every route including the production static server.
app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`ikey. server listening on port ${env.port} (${env.nodeEnv})`);
});
