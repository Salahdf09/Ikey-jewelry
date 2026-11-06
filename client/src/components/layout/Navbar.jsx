import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import MobileMenu from './MobileMenu';
import Logo from '../ui/Logo';

const CATEGORIES = [
  { name: 'Colliers', slug: 'colliers' },
  { name: 'Bagues', slug: 'bagues' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: "Boucles d'oreilles", slug: 'boucles-oreilles' },
];

export default function Navbar({ onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const [bounce, setBounce] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    const grew = itemCount > prevCount.current;
    prevCount.current = itemCount;
    if (!grew) return undefined;

    setBounce(true);
    const t = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(t);
  }, [itemCount]);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/produits?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-petal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            className="lg:hidden p-2 -ml-2 text-plum"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>

          <Link to="/" className="shrink-0">
            <motion.div whileHover={{ scale: 1.08, rotate: 3 }} whileTap={{ scale: 0.95 }}>
              <Logo size={46} />
            </motion.div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-wine">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/produits?category=${c.slug}`}
                className="nav-link hover:text-rose transition-colors py-1"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={() => !query && setSearchOpen(false)}
                    placeholder="rechercher..."
                    className="w-40 sm:w-56 rounded-pill border border-petal-light bg-blush px-4 py-2 text-sm focus:outline-none focus:border-rose"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-plum hover:text-rose transition-colors"
                  aria-label="Rechercher"
                >
                  <Search size={20} strokeWidth={1.75} />
                </button>
              )}
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-plum hover:text-rose transition-colors"
              aria-label="Voir le panier"
            >
              <ShoppingBag size={21} strokeWidth={1.75} className={bounce ? 'animate-bag-bounce' : ''} />
              {itemCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 bg-rose text-cream text-[10px] font-bold rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center transition-transform ${
                    bounce ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} categories={CATEGORIES} />
    </>
  );
}
