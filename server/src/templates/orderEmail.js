function formatDA(amount) {
  return `${Number(amount).toLocaleString('fr-FR').replace(/,/g, ' ')} DA`;
}

// Branded HTML notification sent to STORE_EMAIL whenever a new order comes in.
// Inline styles only — kept table-based for maximum email-client compatibility.
function orderEmailTemplate(order) {
  const rows = order.items
    .map(
      (item, i) => `
        <tr style="background:${i % 2 === 0 ? '#FBEAF0' : '#FFF9FB'};">
          <td style="padding:10px 14px;font-size:14px;color:#72243E;">${item.productName}${
        item.variantName ? `<br/><span style="color:#993556;font-size:12px;">${item.variantName}</span>` : ''
      }</td>
          <td style="padding:10px 14px;font-size:14px;color:#72243E;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 14px;font-size:14px;color:#72243E;text-align:right;">${formatDA(item.unitPrice)}</td>
          <td style="padding:10px 14px;font-size:14px;color:#72243E;text-align:right;font-weight:600;">${formatDA(item.total)}</td>
        </tr>`
    )
    .join('');

  return `
  <div style="background:#FBEAF0;padding:32px 12px;font-family:'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFF9FB;border-radius:16px;overflow:hidden;border:1px solid #F4C0D1;">
      <tr>
        <td style="background:#4B1528;padding:28px 28px 22px;text-align:center;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:1px;color:#FFF9FB;">ikey.</div>
          <div style="color:#ED93B1;font-size:13px;margin-top:6px;">nouvelle commande reçue</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 8px;">
          <div style="display:inline-block;background:#F4C0D1;color:#72243E;font-size:13px;font-weight:600;padding:6px 16px;border-radius:999px;">
            ${order.orderNumber}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#72243E;">
            <tr><td style="padding:6px 0;width:140px;color:#993556;">Client</td><td style="padding:6px 0;font-weight:600;">${order.customerName}</td></tr>
            <tr><td style="padding:6px 0;color:#993556;">Téléphone</td><td style="padding:6px 0;">${order.phone}</td></tr>
            ${order.email ? `<tr><td style="padding:6px 0;color:#993556;">Email</td><td style="padding:6px 0;">${order.email}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#993556;">Wilaya</td><td style="padding:6px 0;">${order.wilaya}</td></tr>
            <tr><td style="padding:6px 0;color:#993556;">Commune</td><td style="padding:6px 0;">${order.commune}</td></tr>
            <tr><td style="padding:6px 0;color:#993556;vertical-align:top;">Adresse</td><td style="padding:6px 0;">${order.address}</td></tr>
            ${order.note ? `<tr><td style="padding:6px 0;color:#993556;vertical-align:top;">Note</td><td style="padding:6px 0;">${order.note}</td></tr>` : ''}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;">
            <tr style="background:#ED93B1;">
              <td style="padding:10px 14px;font-size:12px;color:#4B1528;font-weight:700;">produit</td>
              <td style="padding:10px 14px;font-size:12px;color:#4B1528;font-weight:700;text-align:center;">qté</td>
              <td style="padding:10px 14px;font-size:12px;color:#4B1528;font-weight:700;text-align:right;">prix unit.</td>
              <td style="padding:10px 14px;font-size:12px;color:#4B1528;font-weight:700;text-align:right;">total</td>
            </tr>
            ${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#72243E;">
            <tr><td style="padding:4px 0;text-align:right;color:#993556;">Sous-total</td><td style="padding:4px 0;text-align:right;width:120px;">${formatDA(order.subtotal)}</td></tr>
            <tr><td style="padding:4px 0;text-align:right;color:#993556;">Livraison</td><td style="padding:4px 0;text-align:right;">${formatDA(order.deliveryFee)}</td></tr>
            <tr><td style="padding:10px 0 4px;text-align:right;font-size:17px;color:#D4537E;font-weight:700;">Total</td><td style="padding:10px 0 4px;text-align:right;font-size:17px;color:#D4537E;font-weight:700;">${formatDA(order.total)}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px 28px;">
          <div style="background:#4B1528;color:#FFF9FB;text-align:center;padding:12px;border-radius:999px;font-size:14px;font-weight:600;">
            Paiement : à la livraison
          </div>
        </td>
      </tr>
    </table>
  </div>`;
}

module.exports = { orderEmailTemplate, formatDA };
