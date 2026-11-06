import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import Logo from '../ui/Logo';

export default function MobileMenu({ open, onClose, categories }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-plum/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-cream shadow-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-petal-light">
              <Logo size={36} />
              <button onClick={onClose} className="p-2 text-plum hover:text-rose transition-colors" aria-label="Fermer le menu">
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <motion.nav
              className="flex flex-col p-5 gap-1"
              initial="closed"
              animate="open"
              variants={{ open: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
            >
              <motion.div
                variants={{ closed: { opacity: 0, x: -12 }, open: { opacity: 1, x: 0 } }}
              >
                <Link
                  to="/produits"
                  onClick={onClose}
                  className="py-3 px-3 rounded-xl text-wine font-medium hover:bg-blush flex items-center gap-2 transition-colors"
                >
                  <Heart size={16} strokeWidth={1.75} className="text-rose" />
                  Tous les bijoux
                </Link>
              </motion.div>
              {categories.map((c) => (
                <motion.div
                  key={c.slug}
                  variants={{ closed: { opacity: 0, x: -12 }, open: { opacity: 1, x: 0 } }}
                >
                  <Link
                    to={`/produits?category=${c.slug}`}
                    onClick={onClose}
                    className="block py-3 px-3 rounded-xl text-wine font-medium hover:bg-blush transition-colors"
                  >
                    {c.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
