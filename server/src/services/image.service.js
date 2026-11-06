const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const env = require('../config/env');

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// Swappable image storage. Today only "local" is implemented (disk +
// express.static). To move to S3/Cloudinary/etc later, implement the same
// three functions (storage, getUrl, deleteFile) against that provider and
// switch UPLOAD_DRIVER — nothing else in the app needs to change.
const drivers = {
  local: {
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, UPLOAD_DIR),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
        cb(null, name);
      },
    }),
    getUrl: (filename) => `/uploads/${filename}`,
    deleteFile: (filename) => {
      const filePath = path.join(UPLOAD_DIR, path.basename(filename));
      fs.promises.unlink(filePath).catch(() => {});
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

module.exports = { upload, getUrl: driver.getUrl, deleteFile: driver.deleteFile, UPLOAD_DIR };
