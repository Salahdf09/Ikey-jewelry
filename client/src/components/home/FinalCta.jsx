import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import JewelryBackground from '../ui/JewelryBackground';

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-plum py-24 sm:py-32 text-center">
      <JewelryBackground local />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-lg mx-auto px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-4xl text-cream mb-4">prête à trouver ta pièce ?</h2>
        <p className="text-cream/55 mb-8">livraison partout en Algérie, paiement à la réception.</p>
        <Link to="/produits" className="btn-primary">
          voir toute la collection
        </Link>
      </motion.div>
    </section>
  );
}
