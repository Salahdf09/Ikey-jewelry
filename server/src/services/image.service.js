const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function randomName(originalname) {
  const ext = path.extname(originalname).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
}

// Swappable image storage. Each driver implements the same three things —
// `storage` (a multer storage engine), `saveFile(file)` (persists it
// somewhere and returns { url, filename }) and `deleteFile(filename)` — so
// switching UPLOAD_DRIVER is the only thing that changes; nothing else in
// the app needs to know where images actually live.
const drivers = {
  local: {
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, UPLOAD_DIR),
      filename: (req, file, cb) => cb(null, randomName(file.originalname)),
    }),
    // The file is already written to disk by multer's diskStorage by the
    // time this runs — just report where.
    saveFile: async (file) => ({ url: `/uploads/${file.filename}`, filename: file.filename }),
    deleteFile: (filename) => {
      const filePath = path.join(UPLOAD_DIR, path.basename(filename));
      fs.promises.unlink(filePath).catch(() => {});
    },
  },

  // Supabase Storage. multer keeps the upload in memory (no local disk
  // write) and this driver pushes the buffer to the configured bucket.
  // Requires SUPABASE_URL + SUPABASE_SECRET_KEY (the project's secret /
  // service_role key — server-side only, see SUPABASE.md) and a bucket
  // (SUPABASE_STORAGE_BUCKET) set to "public" so getPublicUrl works.
  supabase: {
    storage: multer.memoryStorage(),
    saveFile: async (file) => {
      const client = createClient(env.supabaseUrl, env.supabaseSecretKey);
      const filename = randomName(file.originalname);

      const { error } = await client.storage.from(env.supabaseBucket).upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
      if (error) {
        const err = new Error(`Échec de l'envoi vers Supabase Storage : ${error.message}`);
        err.statusCode = 502;
        throw err;
      }

      const { data } = client.storage.from(env.supabaseBucket).getPublicUrl(filename);
      return { url: data.publicUrl, filename };
    },
    deleteFile: async (filename) => {
      const client = createClient(env.supabaseUrl, env.supabaseSecretKey);
      await client.storage.from(env.supabaseBucket).remove([filename]).catch(() => {});
    },
  },
};

const driver = drivers[env.uploadDriver] || drivers.local;

const upload = multer({
  storage: driver.storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      const err = new Error('Format d\'image non supporté (jpg, png, webp, avif uniquement).');
      err.statusCode = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

module.exports = { upload, saveFile: driver.saveFile, deleteFile: driver.deleteFile, UPLOAD_DIR };
