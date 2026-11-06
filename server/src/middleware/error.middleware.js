const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next({ statusCode: 404, message: 'Route introuvable' });
}

// Centralized error handler — the only place that formats error responses.
// Never leaks stack traces, SQL, or internal details to the client.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image trop lourde (5 Mo maximum).' : 'Envoi de fichier invalide.';
    return res.status(400).json({ success: false, message });
  }

  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: isServerError ? "Une erreur est survenue. Merci de réessayer." : err.message || 'Erreur',
    ...(err.details ? { details: err.details } : {}),
    ...(!env.isProduction && isServerError ? { stack: err.stack } : {}),
  });
}

module.exports = { notFoundHandler, errorHandler };
