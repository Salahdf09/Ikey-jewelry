const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing required environment variable: ${key}`);
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 5000,
  clientUrl: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  jwtSecret: process.env.JWT_SECRET || 'insecure-dev-secret-change-me',
  cookieName: process.env.COOKIE_NAME || 'ikey_admin_session',
  // "lax" tant que le site et l'API sont sur le même domaine (ex: cPanel).
  // Mettre "none" si le frontend et l'API sont déployés sur deux domaines
  // différents (ex: Vercel) — sinon le cookie de session admin n'est pas
  // envoyé par le navigateur après la connexion.
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  storeEmail: process.env.STORE_EMAIL,
  mailFromName: process.env.MAIL_FROM_NAME || 'ikey.',
  mailFromAddress: process.env.MAIL_FROM_ADDRESS || 'no-reply@ikey-store.com',

  uploadDriver: process.env.UPLOAD_DRIVER || 'local',
  // Utilisés seulement si UPLOAD_DRIVER=supabase (voir SUPABASE.md).
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || 'product-images',
};

module.exports = env;
