const { getTransporter } = require('../config/mailer');
const env = require('../config/env');
const { orderEmailTemplate } = require('../templates/orderEmail');

// Fire-and-log: a failed email must never block or fail the order response,
// since the order is already saved by the time this runs.
async function sendNewOrderEmail(order) {
  if (!env.storeEmail) {
    // eslint-disable-next-line no-console
    console.warn('[email] STORE_EMAIL is not set — skipping order notification email.');
    return;
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: `"${env.mailFromName}" <${env.mailFromAddress}>`,
      to: env.storeEmail,
      subject: `Nouvelle commande ${order.orderNumber} — ikey.`,
      html: orderEmailTemplate(order),
    });
    // eslint-disable-next-line no-console
    console.log(`[email] Order notification sent for ${order.orderNumber} (messageId: ${info.messageId})`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] Failed to send new order notification:', err.message);
  }
}

module.exports = { sendNewOrderEmail };
