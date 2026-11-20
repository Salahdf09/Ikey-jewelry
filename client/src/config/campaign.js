// Photo de campagne de la page d'accueil.
// Elle est FIXE : elle ne se change pas depuis l'admin ni la base de données.
// Pour la remplacer, mets une nouvelle photo dans client/public/images/campaign/
// puis mets à jour CAMPAIGN_RATIO et les positions ci-dessous.
export const CAMPAIGN_PHOTO = '/images/campaign/model.jpg';
export const CAMPAIGN_PHOTO_SMALL = '/images/campaign/model-1000.jpg';

// largeur / hauteur de la photo
export const CAMPAIGN_RATIO = 2000 / 1600;

// Points cliquables posés SUR les bijoux de la photo.
// x / y = position en % de la largeur / hauteur de la photo.
// category = slug de la catégorie ouverte au clic (/produits?category=...).
export const HOTSPOTS = [
  { id: 'collier-goutte', label: 'les colliers', x: 49.5, y: 33, category: 'colliers' },
  { id: 'collier-lariat', label: 'les colliers', x: 48.2, y: 76, category: 'colliers' },
  { id: 'bague-ovale', label: 'les bagues', x: 42.4, y: 45.8, category: 'bagues' },
  { id: 'bagues-chevron', label: 'les bagues', x: 67.3, y: 66.7, category: 'bagues' },
  { id: 'jonc', label: 'les bracelets', x: 21.3, y: 82, category: 'bracelets' },
];

// Gros plans (zoom dans la photo) qui tournent autour du pendentif au début.
export const ORBIT_CROPS = [
  { x: 49.5, y: 33, zoom: 2.6 },
  { x: 42.4, y: 45.8, zoom: 2.8 },
  { x: 67, y: 67, zoom: 2.8 },
  { x: 22, y: 82, zoom: 2.6 },
  { x: 48, y: 74, zoom: 2.4 },
  { x: 62, y: 72, zoom: 2.8 },
  { x: 48, y: 40, zoom: 2 },
  { x: 70, y: 40, zoom: 2 },
];

// Le gros plan qui grandit jusqu'à révéler toute la photo.
export const START_CROP = { x: 42.4, y: 45.8, zoom: 2.6 };
