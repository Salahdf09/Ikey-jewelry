// Looks up a fee from the table fetched from GET /api/delivery-fees — this
// preview is never hardcoded, so it can't go stale against the server's own
// table (server/src/utils/wilayas.js), which still recalculates and is the
// source of truth for the final total.
export function estimateDeliveryFee(fees, wilaya, deliveryType = 'domicile', deliverySpeed = 'express') {
  if (!wilaya || !fees?.length) return null;
  const entry = fees.find((f) => f.wilaya.toLowerCase() === wilaya.trim().toLowerCase());
  if (!entry) return null;
  const bySpeed = entry[deliverySpeed] ?? entry.express;
  return bySpeed[deliveryType] ?? bySpeed.domicile;
}
