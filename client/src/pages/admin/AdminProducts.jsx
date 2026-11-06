import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { adminFetchProducts, adminDeleteProduct, adminUpdateProduct } from '../../services/admin.service';
import { formatDA } from '../../utils/currency';

export default function AdminProducts() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    adminFetchProducts({ q, limit: 50 })
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function toggleActive(product) {
    try {
      await adminUpdateProduct(product.id, { isActive: !product.isActive });
      toast.success('Produit mis à jour');
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  }

  // An in-app confirmation instead of window.confirm() — native dialogs are
  // easy to miss, look out of place next to the rest of this UI, and some
  // browsers silently auto-dismiss repeated ones after a few uses, which
  // made delete look broken with no error or feedback at all.
  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(toDelete.id);
      toast.success('Produit supprimé');
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">produits</h1>
          <p className="text-sm text-slate-500 mt-1">{data.total} produit{data.total === 1 ? '' : 's'}</p>
        </div>
        <Link
          to="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
        >
          <Plus size={16} strokeWidth={2} /> nouveau produit
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="rechercher un produit..."
          className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">produit</th>
                <th className="px-6 py-3 font-medium">catégorie</th>
                <th className="px-6 py-3 font-medium">prix</th>
                <th className="px-6 py-3 font-medium">stock</th>
                <th className="px-6 py-3 font-medium">statut</th>
                <th className="px-6 py-3 font-medium text-right">actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">chargement...</td></tr>
              )}
              {!loading && data.items.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">aucun produit.</td></tr>
              )}
              {!loading && data.items.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-slate-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-500">{p.category?.name}</td>
                  <td className="px-6 py-3 text-slate-600">{formatDA(p.price)}</td>
                  <td className="px-6 py-3 text-slate-600">{p.trackStock ? p.stock : '∞'}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.isActive ? 'actif' : 'désactivé'}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/produits/${p.id}`} className="p-2 text-slate-500 hover:text-slate-800" aria-label="Modifier">
                        <Pencil size={15} strokeWidth={1.75} />
                      </Link>
                      <button onClick={() => setToDelete(p)} className="p-2 text-slate-500 hover:text-red-600" aria-label="Supprimer">
                        <Trash2 size={15} strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-base font-semibold text-slate-800">supprimer ce produit ?</h2>
            <p className="text-sm text-slate-500 mt-2">
              « {toDelete.name} » sera supprimé définitivement. Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60"
              >
                {deleting ? 'suppression...' : 'supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
