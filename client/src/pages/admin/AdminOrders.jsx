import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { adminFetchOrders } from '../../services/admin.service';
import { formatDA } from '../../utils/currency';
import StatusBadge from '../../components/admin/StatusBadge';

const STATUSES = ['PENDING', 'DELIVERED', 'CANCELLED'];
const LABELS = { PENDING: 'en attente', DELIVERED: 'livrée', CANCELLED: 'annulée' };

export default function AdminOrders() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    adminFetchOrders({ q, status, limit: 50 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [q, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">commandes</h1>
        <p className="text-sm text-slate-500 mt-1">{data.total} commande{data.total === 1 ? '' : 's'}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="rechercher (numéro, nom, téléphone)..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        >
          <option value="">tous les statuts</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">numéro</th>
                <th className="px-6 py-3 font-medium">client</th>
                <th className="px-6 py-3 font-medium">téléphone</th>
                <th className="px-6 py-3 font-medium">wilaya</th>
                <th className="px-6 py-3 font-medium">total</th>
                <th className="px-6 py-3 font-medium">statut</th>
                <th className="px-6 py-3 font-medium">date</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">chargement...</td></tr>}
              {!loading && data.items.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">aucune commande.</td></tr>
              )}
              {!loading && data.items.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <Link to={`/admin/commandes/${o.id}`} className="font-medium text-slate-700 hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{o.customerName}</td>
                  <td className="px-6 py-3 text-slate-600">{o.phone}</td>
                  <td className="px-6 py-3 text-slate-600">{o.wilaya}</td>
                  <td className="px-6 py-3 text-slate-600">{formatDA(o.total)}</td>
                  <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-3 text-slate-500">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
