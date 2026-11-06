import { Link } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid';
import Reveal from '../ui/Reveal';

export default function FeaturedProducts({ title, subtitle, products, loading, viewAllHref }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <Reveal className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl">{title}</h2>
          {subtitle && <p className="text-wine/60 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="text-sm font-semibold text-rose hover:text-rose-deep shrink-0 transition-transform hover:translate-x-0.5"
          >
            tout voir →
          </Link>
        )}
      </Reveal>
      <ProductGrid products={products} loading={loading} />
    </section>
  );
}
