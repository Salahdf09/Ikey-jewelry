import { useEffect, useState } from 'react';
import CampaignHero from '../components/home/CampaignHero';
import JewelShowcase from '../components/home/JewelShowcase';
import JewelryCategories from '../components/home/JewelryCategories';
import AboutBrand from '../components/home/AboutBrand';
import FinalCta from '../components/home/FinalCta';
import { fetchProducts } from '../services/products.service';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Mets en avant tes coups de cœur s'il y en a, sinon les derniers produits.
    Promise.all([fetchProducts({ featured: 'true', limit: 24 }), fetchProducts({ limit: 24 })]).then(([feat, all]) => {
      const ids = new Set(feat.items.map((p) => p.id));
      setProducts([...feat.items, ...all.items.filter((p) => !ids.has(p.id))]);
    });
  }, []);

  return (
    <div>
      <CampaignHero />
      <JewelShowcase products={products} />
      <JewelryCategories />
      <AboutBrand />
      <FinalCta />
    </div>
  );
}
