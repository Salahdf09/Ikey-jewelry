const router = require('express').Router();
const { uploadImage } = require('../controllers/upload.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const { upload } = require('../services/image.service');

router.post('/', requireAdmin, upload.single('image'), uploadImage);

module.exports = router;
