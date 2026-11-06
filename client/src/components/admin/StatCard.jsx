import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';

export default function StatCard({ label, value, format, icon: Icon, tone = 'slate', delay = 0 }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric ? value : 0);
  const display = isNumeric ? (format ? format(animated) : animated) : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        {Icon && <Icon size={20} strokeWidth={1.75} />}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{display}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}
