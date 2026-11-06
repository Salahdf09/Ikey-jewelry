import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';

const IMAGES = {
  colliers: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=500&q=80',
  bagues: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
  bracelets: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=80',
  'boucles-oreilles': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80',
};

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal as="h2" className="text-2xl sm:text-3xl text-center mb-10">
        nos catégories
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 80}>
            <Link
              to={`/produits?category=${c.slug}`}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/5] border border-petal-light transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-petal/30 hover:border-petal"
            >
              <img
                src={IMAGES[c.slug] || IMAGES.colliers}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-plum/0 to-transparent" />
              <span className="absolute bottom-4 left-0 right-0 text-center text-cream font-display text-lg">
                {c.name}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
