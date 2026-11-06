import { Truck, Heart, Sparkles, Gift } from 'lucide-react';

const MESSAGES = [
  { icon: Truck, text: 'paiement à la livraison, partout en Algérie' },
  { icon: Sparkles, text: 'fait main, avec tendresse' },
  { icon: Gift, text: '-10% sur ta première commande' },
  { icon: Heart, text: 'des bijoux qui te ressemblent' },
];

function Track({ hidden = false }) {
  return (
    <div className="flex items-center gap-10 pr-10 shrink-0" aria-hidden={hidden}>
      {MESSAGES.map(({ icon: Icon, text }, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap">
          <Icon size={14} strokeWidth={1.75} className="text-petal shrink-0" />
          {text}
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="bg-plum text-cream text-xs sm:text-sm py-2.5 overflow-hidden">
      <div className="marquee-track flex w-max motion-reduce:animate-none">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
