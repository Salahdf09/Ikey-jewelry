// The 58 wilayas (provinces) of Algeria, in official numeric order.
const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
  'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun',
  'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah',
  'In Guezzam', 'Touggourt', 'Djanet', "El M'Ghair", 'El Menia',
];

const DELIVERY_TYPES = ['domicile', 'stopdesk'];
const DELIVERY_SPEEDS = ['express', 'economique'];

// Real rates (DA) from Guepex's two tariffs: "ECOMMERCE" (faster, here
// called `express`) and "ECONOMIQUE" (slower, cheaper). `domicile` is door
// delivery, `stopdesk` is pickup at their local desk — both tiers price
// stopdesk cheaper than domicile, same zone grouping either way.
const DELIVERY_FEES = {
  Blida: { express: { domicile: 590, stopdesk: 450 }, economique: { domicile: 500, stopdesk: 400 } },
  Alger: { express: { domicile: 590, stopdesk: 450 }, economique: { domicile: 500, stopdesk: 400 } },

  Bouira: { express: { domicile: 700, stopdesk: 550 }, economique: { domicile: 550, stopdesk: 450 } },
  'Tizi Ouzou': { express: { domicile: 700, stopdesk: 550 }, economique: { domicile: 550, stopdesk: 450 } },
  Boumerdès: { express: { domicile: 700, stopdesk: 550 }, economique: { domicile: 550, stopdesk: 450 } },
  Tipaza: { express: { domicile: 700, stopdesk: 550 }, economique: { domicile: 550, stopdesk: 450 } },

  Chlef: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  'Oum El Bouaghi': { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Batna: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Béjaïa: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Tlemcen: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Sétif: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Skikda: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  'Sidi Bel Abbès': { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Annaba: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Guelma: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Constantine: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Médéa: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Mostaganem: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  "M'Sila": { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Mascara: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Oran: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  'Bordj Bou Arréridj': { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  'Aïn Defla': { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },
  Relizane: { express: { domicile: 900, stopdesk: 650 }, economique: { domicile: 700, stopdesk: 600 } },

  Biskra: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Tiaret: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Jijel: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Saïda: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  'El Tarf': { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Tissemsilt: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Khenchela: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  'Souk Ahras': { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  Mila: { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },
  'Aïn Témouchent': { express: { domicile: 950, stopdesk: 750 }, economique: { domicile: 850, stopdesk: 700 } },

  Laghouat: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  Tébessa: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  Djelfa: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  Ouargla: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  'El Oued': { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  Ghardaïa: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  'Ouled Djellal': { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  Touggourt: { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  "El M'Ghair": { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },
  'El Menia': { express: { domicile: 1050, stopdesk: 850 }, economique: { domicile: 1000, stopdesk: 800 } },

  Adrar: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Béchar: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Tamanrasset: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  'El Bayadh': { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Illizi: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Tindouf: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Naâma: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Timimoun: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  'Bordj Badji Mokhtar': { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  'Béni Abbès': { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  'In Salah': { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  'In Guezzam': { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
  Djanet: { express: { domicile: 1600, stopdesk: 1400 }, economique: { domicile: 1500, stopdesk: 1300 } },
};

const DEFAULT_DELIVERY_FEES = {
  express: { domicile: 900, stopdesk: 650 },
  economique: { domicile: 700, stopdesk: 600 },
};

function ratesForWilaya(wilaya) {
  if (!wilaya) return DEFAULT_DELIVERY_FEES;
  const match = WILAYAS.find((w) => w.toLowerCase() === wilaya.trim().toLowerCase());
  return (match && DELIVERY_FEES[match]) || DEFAULT_DELIVERY_FEES;
}

function deliveryFeeForWilaya(wilaya, deliveryType = 'domicile', deliverySpeed = 'express') {
  const rates = ratesForWilaya(wilaya);
  const speed = rates[DELIVERY_SPEEDS.includes(deliverySpeed) ? deliverySpeed : 'express'];
  return speed[DELIVERY_TYPES.includes(deliveryType) ? deliveryType : 'domicile'];
}

module.exports = {
  WILAYAS,
  DELIVERY_TYPES,
  DELIVERY_SPEEDS,
  DELIVERY_FEES,
  deliveryFeeForWilaya,
  ratesForWilaya,
};
