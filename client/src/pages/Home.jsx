import { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import FeaturedShowcase from '../components/home/FeaturedShowcase';
import JewelryCategories from '../components/home/JewelryCategories';
import AboutBrand from '../components/home/AboutBrand';
import FinalCta from '../components/home/FinalCta';
import { fetchProducts } from '../services/products.service';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    Promise.all([fetchProducts({ featured: 'true', limit: 4 }), fetchProducts({ isNew: 'true', limit: 8 })]).then(
      ([feat, news]) => {
        setFeatured(feat.items);
        setNewArrivals(news.items);
      }
    );
  }, []);

  const storyProducts = newArrivals.length ? newArrivals : featured;

  return (
    <div>
      <Hero products={featured} />
      <FeaturedShowcase products={storyProducts} />
      <JewelryCategories />
      <AboutBrand />
      <FinalCta />
    </div>
  );
}
