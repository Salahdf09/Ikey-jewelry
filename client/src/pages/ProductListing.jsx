import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { fetchProducts, fetchCategories } from '../services/products.service';

const CATEGORY_LABELS = {
  colliers: 'Colliers',
  bagues: 'Bagues',
  bracelets: 'Bracelets',
  'boucles-oreilles': "Boucles d'oreilles",
};

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const featured = searchParams.get('featured') || '';
  const isNew = searchParams.get('isNew') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category, q, featured, isNew, page, limit: 12 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [category, q, featured, isNew, page]);

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  }

  function setCategory(slug) {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    next.delete('page');
    setSearchParams(next);
  }

  let heading = 'tous nos bijoux';
  if (category) heading = CATEGORY_LABELS[category] || category;
  if (q) heading = `résultats pour "${q}"`;
  if (featured === 'true') heading = 'nos coups de cœur';
  if (isNew === 'true') heading = 'nouveautés';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl mb-2">{heading}</h1>
      <p className="text-wine/60 text-sm mb-8">{loading ? '...' : `${data.total} produit${data.total === 1 ? '' : 's'}`}</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`btn-pill text-sm px-4 py-2 border ${
            !category ? 'bg-plum text-cream border-plum' : 'border-petal-light text-wine hover:border-rose'
          }`}
        >
          tout
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`btn-pill text-sm px-4 py-2 border ${
              category === c.slug ? 'bg-plum text-cream border-plum' : 'border-petal-light text-wine hover:border-rose'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <ProductGrid products={data.items} loading={loading} emptyMessage="aucun produit ne correspond à ta recherche." />

      {!loading && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="p-2 rounded-full border border-petal-light text-wine disabled:opacity-30 hover:border-rose"
            aria-label="Page précédente"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <span className="text-sm text-wine/70">
            page {data.page} / {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => goToPage(page + 1)}
            className="p-2 rounded-full border border-petal-light text-wine disabled:opacity-30 hover:border-rose"
            aria-label="Page suivante"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      )}
    </div>
  );
}
