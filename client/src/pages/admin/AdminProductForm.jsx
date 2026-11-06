import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import {
  adminFetchProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUploadImage,
} from '../../services/admin.service';
import { fetchCategories } from '../../services/products.service';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  compareAtPrice: '',
  stock: '0',
  trackStock: true,
  isActive: true,
  isFeatured: false,
  isNew: false,
  categoryId: '',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminFetchProduct(id)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
          stock: String(p.stock),
          trackStock: p.trackStock,
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          categoryId: p.categoryId,
        });
        setImages(p.images.map((img) => ({ url: img.url })));
        setVariants(p.variants.map((v) => ({ id: v.id, name: v.name, priceDelta: v.priceDelta, stock: v.stock, isActive: v.isActive })));
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // The storefront uses each finish's own stock, so a product-level quantity
  // has to reach every finish or the product still shows as sold out there.
  function updateStock(value) {
    setForm((f) => ({ ...f, stock: value }));
    setVariants((vs) => vs.map((v) => ({ ...v, stock: value })));
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminUploadImage(file);
      setImages((imgs) => [...imgs, { url }]);
    } catch {
      toast.error("Échec de l'envoi de l'image");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(idx) {
    setImages((imgs) => imgs.filter((_, i) => i !== idx));
  }

  function addVariant() {
    setVariants((v) => [...v, { name: '', priceDelta: 0, stock: 0, isActive: true }]);
  }

  function updateVariant(idx, field, value) {
    setVariants((v) => v.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  }

  function removeVariant(idx) {
    setVariants((v) => v.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.categoryId || form.price === '') {
      toast.error('Merci de remplir tous les champs requis.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
      trackStock: form.trackStock,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      categoryId: form.categoryId,
      images: images.map((img, i) => ({ url: img.url, position: i })),
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          ...(v.id ? { id: v.id } : {}),
          name: v.name.trim(),
          priceDelta: Number(v.priceDelta) || 0,
          stock: Number(v.stock) || 0,
          isActive: v.isActive,
        })),
    };

    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateProduct(id, payload);
        toast.success('Produit mis à jour');
      } else {
        await adminCreateProduct(payload);
        toast.success('Produit créé');
      }
      navigate('/admin/produits');
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-slate-400 text-sm">chargement...</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/produits" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5">
        <ArrowLeft size={15} strokeWidth={1.75} /> retour aux produits
      </Link>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">{isEdit ? 'modifier le produit' : 'nouveau produit'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">nom *</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">description *</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">catégorie *</label>
              <select
                value={form.categoryId}
                onChange={(e) => update('categoryId', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              >
                <option value="">choisir...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
                actif
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
                coup de cœur
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isNew} onChange={(e) => update('isNew', e.target.checked)} />
                nouveau
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">prix (DA) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ancien prix (DA)</label>
              <input
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={(e) => update('compareAtPrice', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateStock(e.target.value)}
                disabled={!form.trackStock}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 disabled:bg-slate-50"
              />
              {variants.length > 0 && (
                <p className="text-xs text-slate-500 mt-1">appliqué à chaque finition, ajustable ci-dessous.</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.trackStock} onChange={(e) => update('trackStock', e.target.checked)} />
            suivre le stock pour ce produit
          </label>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">images</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-600"
                >
                  <Trash2 size={12} strokeWidth={2} />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 text-slate-400">
              <Upload size={18} strokeWidth={1.75} />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
          {uploading && <p className="text-xs text-slate-400">envoi en cours...</p>}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700">variantes (finitions)</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <Plus size={14} strokeWidth={2} /> ajouter
            </button>
          </div>

          {variants.length === 0 && <p className="text-sm text-slate-400">aucune variante — le produit n'aura qu'un seul prix.</p>}

          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-[1fr,110px,90px,auto] gap-2 items-center">
                <input
                  placeholder="nom (ex: Plaqué or)"
                  value={v.name}
                  onChange={(e) => updateVariant(i, 'name', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
                <input
                  type="number"
                  placeholder="+/- prix"
                  value={v.priceDelta}
                  onChange={(e) => updateVariant(i, 'priceDelta', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="stock"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
                <button type="button" onClick={() => removeVariant(i)} className="p-2 text-slate-400 hover:text-red-600">
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'enregistrement...' : isEdit ? 'enregistrer les modifications' : 'créer le produit'}
          </button>
          <Link to="/admin/produits" className="rounded-lg px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
