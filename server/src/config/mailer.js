const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtp.host || !env.smtp.user || !env.smtp.password) {
    // eslint-disable-next-line no-console
    console.warn('[mailer] SMTP not fully configured — order emails will fail to send.');
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user
      ? {
          user: env.smtp.user,
          pass: env.smtp.password,
        }
      : undefined,
  });

  return transporter;
}

module.exports = { getTransporter };
