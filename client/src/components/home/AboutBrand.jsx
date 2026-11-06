import Reveal from '../ui/Reveal';

// Deliberately short — one idea, not a brand essay.
export default function AboutBrand() {
  return (
    <section className="bg-cream py-24 sm:py-32">
      <Reveal className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-rose font-semibold mb-5">ikey.</p>
        <h2 className="text-3xl sm:text-4xl leading-tight">
          chaque pièce est façonnée à la main, pour accompagner une histoire précise — la tienne.
        </h2>
      </Reveal>
    </section>
  );
}
