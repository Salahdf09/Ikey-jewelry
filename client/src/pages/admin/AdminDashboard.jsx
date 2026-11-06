import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ClipboardList, Clock, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { adminFetchStats } from '../../services/admin.service';
import { formatDA } from '../../utils/currency';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetchStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return <div className="text-slate-400 text-sm">chargement...</div>;
  }

  const maxOrders = Math.max(1, ...stats.chart.map((d) => d.orders));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">tableau de bord</h1>
        <p className="text-sm text-slate-500 mt-1">vue d'ensemble de la boutique ikey.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="commandes totales" value={stats.orders.total} icon={ClipboardList} tone="slate" delay={0} />
        <StatCard label="en attente" value={stats.orders.pending} icon={Clock} tone="amber" delay={40} />
        <StatCard label="livrées" value={stats.orders.delivered} icon={CheckCircle2} tone="emerald" delay={80} />
        <StatCard label="annulées" value={stats.orders.cancelled} icon={XCircle} tone="red" delay={120} />
        <StatCard
          label="produits actifs"
          value={`${stats.products.active}/${stats.products.total}`}
          icon={Package}
          tone="slate"
          delay={160}
        />
        <StatCard label="revenu (livrées)" value={stats.revenue} format={formatDA} icon={Wallet} tone="rose" delay={200} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-5">commandes — 14 derniers jours</h2>
        <div className="flex items-end gap-1.5 h-32">
          {stats.chart.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <motion.div
                className="w-full bg-rose/80 group-hover:bg-rose rounded-t transition-colors"
                initial={{ height: 0 }}
                animate={{ height: `${(d.orders / maxOrders) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                style={{ minHeight: d.orders > 0 ? '4px' : '1px' }}
                title={`${d.date}: ${d.orders} commande(s)`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
          <span>{stats.chart[0]?.date}</span>
          <span>{stats.chart[stats.chart.length - 1]?.date}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">commandes récentes</h2>
          <Link to="/admin/commandes" className="text-xs font-medium text-slate-500 hover:text-slate-800">
            tout voir →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">numéro</th>
                <th className="px-6 py-3 font-medium">client</th>
                <th className="px-6 py-3 font-medium">total</th>
                <th className="px-6 py-3 font-medium">statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-3">
                    <Link to={`/admin/commandes/${o.id}`} className="font-medium text-slate-700 hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{o.customerName}</td>
                  <td className="px-6 py-3 text-slate-600">{formatDA(o.total)}</td>
                  <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                </motion.tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">aucune commande pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
