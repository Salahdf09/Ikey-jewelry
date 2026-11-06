import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { adminFetchOrder, adminUpdateOrderStatus } from '../../services/admin.service';
import { formatDA } from '../../utils/currency';
import StatusBadge from '../../components/admin/StatusBadge';

const STATUSES = ['PENDING', 'DELIVERED', 'CANCELLED'];
const LABELS = { PENDING: 'en attente', DELIVERED: 'livrée', CANCELLED: 'annulée' };

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    adminFetchOrder(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status) {
    setUpdating(true);
    try {
      const updated = await adminUpdateOrderStatus(id, status);
      setOrder(updated);
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="text-slate-400 text-sm">chargement...</div>;
  if (!order) return <div className="text-slate-400 text-sm">commande introuvable.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <Link to="/admin/commandes" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} strokeWidth={1.75} /> retour aux commandes
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{order.orderNumber}</h1>
          <p className="text-sm text-slate-500 mt-1">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">client</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">nom</dt><dd className="text-slate-700 font-medium">{order.customerName}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">téléphone</dt><dd className="text-slate-700">{order.phone}</dd></div>
            {order.email && <div className="flex justify-between"><dt className="text-slate-500">email</dt><dd className="text-slate-700">{order.email}</dd></div>}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">livraison</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">mode</dt><dd className="text-slate-700">{order.deliveryType === 'stopdesk' ? 'point relais (stop-desk)' : 'à domicile'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">vitesse</dt><dd className="text-slate-700">{order.deliverySpeed === 'economique' ? 'économique' : 'express'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">wilaya</dt><dd className="text-slate-700">{order.wilaya}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">commune</dt><dd className="text-slate-700">{order.commune}</dd></div>
            <div><dt className="text-slate-500 mb-1">adresse</dt><dd className="text-slate-700">{order.address}</dd></div>
            {order.note && <div><dt className="text-slate-500 mb-1">note</dt><dd className="text-slate-700">{order.note}</dd></div>}
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">produits</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
              <th className="py-2 font-medium">produit</th>
              <th className="py-2 font-medium">quantité</th>
              <th className="py-2 font-medium">prix unitaire</th>
              <th className="py-2 font-medium text-right">total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 text-slate-700">
                  {item.productName}
                  {item.variantName && <span className="text-slate-400"> — {item.variantName}</span>}
                </td>
                <td className="py-2.5 text-slate-600">{item.quantity}</td>
                <td className="py-2.5 text-slate-600">{formatDA(item.unitPrice)}</td>
                <td className="py-2.5 text-right font-medium text-slate-700">{formatDA(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-slate-100 mt-4 pt-4 space-y-1.5 text-sm max-w-xs ml-auto">
          <div className="flex justify-between"><span className="text-slate-500">sous-total</span><span>{formatDA(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">livraison</span><span>{formatDA(order.deliveryFee)}</span></div>
          <div className="flex justify-between text-base pt-1.5 border-t border-slate-100 font-semibold text-slate-800">
            <span>total</span><span>{formatDA(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
