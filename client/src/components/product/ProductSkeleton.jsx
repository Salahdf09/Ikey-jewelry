export default function ProductSkeleton() {
  return (
    <div>
      <div className="aspect-square rounded-2xl skeleton-shimmer" />
      <div className="mt-3 h-3.5 w-3/4 rounded skeleton-shimmer" />
      <div className="mt-2 h-3.5 w-1/3 rounded skeleton-shimmer" />
    </div>
  );
}
