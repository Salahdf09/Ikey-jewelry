import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Instagram, Truck, Gift, Lock } from 'lucide-react';
import Logo from '../ui/Logo';
import Reveal from '../ui/Reveal';

const INSTAGRAM_URL = 'https://www.instagram.com/ikey.jewelry?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';
const TIKTOK_URL = 'https://www.tiktok.com/@ikey.jewelry?_r=1&_t=ZS-996Z8nm6lD3';

// lucide-react has no TikTok glyph (it only ships generic icons, not brand
// logos), so this one's a plain inline SVG sized/stroked to match.
function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-.9-.98-1.45-2.25-1.5-3.63V2h-3.45v13.4a2.59 2.59 0 1 1-2.1-2.54V9.4a5.86 5.86 0 0 0-1-.08A5.9 5.9 0 1 0 14.55 15c.04-.1.06-.21.06-.33V9.1a9.3 9.3 0 0 0 5.39 1.72V7.37a5.57 5.57 0 0 1-3.4-1.55Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-plum text-cream mt-20">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={64} tone="light" className="mb-4" />
          <p className="text-sm text-petal-light/90 leading-relaxed max-w-xs">
            des bijoux faits main, pensés pour accompagner tes petits moments du quotidien.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <motion.a
              whileHover={{ scale: 1.12, rotate: -6 }}
              whileTap={{ scale: 0.92 }}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
            >
              <Instagram size={16} strokeWidth={1.75} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.12, rotate: 6 }}
              whileTap={{ scale: 0.92 }}
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
            >
              <TikTokIcon size={16} />
            </motion.a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-petal mb-3">boutique</h4>
          <ul className="space-y-2 text-sm text-cream/85">
            <li><Link to="/produits?category=colliers" className="hover:text-petal">colliers</Link></li>
            <li><Link to="/produits?category=bagues" className="hover:text-petal">bagues</Link></li>
            <li><Link to="/produits?category=bracelets" className="hover:text-petal">bracelets</Link></li>
            <li><Link to="/produits?category=boucles-oreilles" className="hover:text-petal">boucles d'oreilles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-petal mb-3">livraison</h4>
          <ul className="space-y-2 text-sm text-cream/85">
            <li className="flex items-center gap-2"><Truck size={14} strokeWidth={1.75} /> paiement à la livraison</li>
            <li className="flex items-center gap-2"><Gift size={14} strokeWidth={1.75} /> livraison partout en Algérie</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-petal mb-3">contact</h4>
          <ul className="space-y-2 text-sm text-cream/85">
            <li>Ikrammekkaoui12@gmail.com</li>
            <li>07 80724198</li>
          </ul>
        </div>
      </Reveal>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/60 flex items-center justify-center gap-1.5">
        fait avec
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' }}
        >
          <Heart size={12} className="text-rose fill-rose" />
        </motion.span>
        en Algérie — © {new Date().getFullYear()} ikey.
      </div>

      {/* Icon-only — kept out of the normal footer flow so it doesn't read
          as a promoted nav item; pinned to the corner for whoever already
          knows to look for it. */}
      <Link
        to="/admin/login"
        aria-label="espace admin"
        className="fixed bottom-4 left-4 z-40 p-2 rounded-full text-cream/40 hover:text-petal hover:bg-cream/10 transition-colors"
      >
        <Lock size={14} strokeWidth={1.75} />
      </Link>
    </footer>
  );
}
