const asyncHandler = require('../utils/asyncHandler');
const { WILAYAS, DELIVERY_FEES } = require('../utils/wilayas');

// Public — the checkout page needs this to preview the fee before
// submitting. The server still recalculates it from this same table when
// the order is actually placed, so there's one source of truth either way.
const listDeliveryFees = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: WILAYAS.map((wilaya) => ({ wilaya, ...DELIVERY_FEES[wilaya] })),
  });
});

module.exports = { listDeliveryFees };
