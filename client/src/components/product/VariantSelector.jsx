export default function VariantSelector({ variants, selected, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div>
      <p className="label-field">finition</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isActive = selected?.id === v.id;
          const outOfStock = v.stock <= 0;
          return (
            <button
              key={v.id}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(v)}
              className={`btn-pill border text-sm px-5 py-2 ${
                isActive
                  ? 'bg-rose text-cream border-rose'
                  : 'bg-cream text-wine border-petal-light hover:border-rose'
              } ${outOfStock ? 'opacity-40 pointer-events-none' : ''}`}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
