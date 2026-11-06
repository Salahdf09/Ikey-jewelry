import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto mb-5">
        <Gem size={26} strokeWidth={1.5} className="text-petal" />
      </div>
      <h1 className="text-3xl mb-3">page introuvable</h1>
      <p className="text-wine/60 mb-6 text-sm">cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary">retour à l'accueil</Link>
    </div>
  );
}
