const STYLES = {
  PENDING: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const LABELS = {
  PENDING: 'en attente',
  DELIVERED: 'livrée',
  CANCELLED: 'annulée',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || 'bg-slate-100 text-slate-700'}`}>
      {LABELS[status] || status}
    </span>
  );
}

export { LABELS as STATUS_LABELS };
