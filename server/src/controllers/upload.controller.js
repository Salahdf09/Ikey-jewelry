const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const imageService = require('../services/image.service');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Aucun fichier reçu.');

  const { url, filename } = await imageService.saveFile(req.file);
  res.status(201).json({ success: true, data: { url, filename } });
});

module.exports = { uploadImage };
