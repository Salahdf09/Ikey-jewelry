const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const imageService = require('../services/image.service');

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Aucun fichier reçu.');

  res.status(201).json({
    success: true,
    data: { url: imageService.getUrl(req.file.filename), filename: req.file.filename },
  });
});

module.exports = { uploadImage };
