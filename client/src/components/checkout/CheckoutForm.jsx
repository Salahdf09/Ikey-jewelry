import { useState } from 'react';
import { WILAYAS } from '../../utils/wilayas';
import { formatDA } from '../../utils/currency';

const initial = {
  customerName: '',
  phone: '',
  email: '',
  wilaya: '',
  deliverySpeed: 'express',
  deliveryType: 'domicile',
  commune: '',
  address: '',
  note: '',
};

function validate(values) {
  const errors = {};
  if (!values.customerName.trim()) errors.customerName = 'Le nom complet est requis.';
  if (!/^(0)(5|6|7)[0-9]{8}$/.test(values.phone.trim())) errors.phone = 'Numéro de téléphone algérien invalide (ex: 0555123456).';
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = 'Email invalide.';
  if (!values.wilaya) errors.wilaya = 'Choisis ta wilaya.';
  if (!values.commune.trim()) errors.commune = 'La commune est requise.';
  if (!values.address.trim()) errors.address = "L'adresse de livraison est requise.";
  return errors;
}

export default function CheckoutForm({ onSubmit, submitting, serverErrors = {}, deliveryFees = [], onValuesChange }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const wilayaFees = deliveryFees.find((f) => f.wilaya === values.wilaya);

  function update(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    onValuesChange?.(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(values);
  }

  const fieldError = (name) => errors[name] || serverErrors[name];

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-5">
      <h2 className="font-display text-lg text-plum">tes informations</h2>

      <div>
        <label className="label-field" htmlFor="customerName">nom complet *</label>
        <input
          id="customerName"
          className="input-field"
          value={values.customerName}
          onChange={(e) => update('customerName', e.target.value)}
          placeholder="ex: Amina Belkacem"
        />
        {fieldError('customerName') && <p className="text-xs text-rose mt-1">{fieldError('customerName')}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-field" htmlFor="phone">téléphone *</label>
          <input
            id="phone"
            className="input-field"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="0555 123 456"
            inputMode="tel"
          />
          {fieldError('phone') && <p className="text-xs text-rose mt-1">{fieldError('phone')}</p>}
        </div>
        <div>
          <label className="label-field" htmlFor="email">email (optionnel)</label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="toi@example.com"
          />
          {fieldError('email') && <p className="text-xs text-rose mt-1">{fieldError('email')}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-field" htmlFor="wilaya">wilaya *</label>
          <select
            id="wilaya"
            className="input-field"
            value={values.wilaya}
            onChange={(e) => update('wilaya', e.target.value)}
          >
            <option value="">choisir...</option>
            {WILAYAS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {fieldError('wilaya') && <p className="text-xs text-rose mt-1">{fieldError('wilaya')}</p>}
        </div>
        <div>
          <label className="label-field" htmlFor="commune">commune *</label>
          <input
            id="commune"
            className="input-field"
            value={values.commune}
            onChange={(e) => update('commune', e.target.value)}
            placeholder="ex: Hydra"
          />
          {fieldError('commune') && <p className="text-xs text-rose mt-1">{fieldError('commune')}</p>}
        </div>
      </div>

      <div>
        <p className="label-field">vitesse de livraison *</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { speed: 'express', label: 'express', hint: 'livraison plus rapide' },
            { speed: 'economique', label: 'économique', hint: 'tarif plus bas' },
          ].map(({ speed, label, hint }) => {
            const active = values.deliverySpeed === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => update('deliverySpeed', speed)}
                className={`text-left rounded-2xl border px-4 py-3 transition-colors ${
                  active ? 'border-rose bg-blush' : 'border-petal-light hover:border-rose/50'
                }`}
              >
                <span className="block text-sm font-semibold text-plum capitalize">{label}</span>
                <span className="block text-xs text-wine/50 mt-0.5">{hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label-field">mode de livraison *</p>
        {!wilayaFees ? (
          <p className="text-sm text-wine/50">choisis ta wilaya pour voir les tarifs de livraison.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { type: 'domicile', label: 'à domicile' },
              { type: 'stopdesk', label: 'point relais (stop-desk)' },
            ].map(({ type, label }) => {
              const active = values.deliveryType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => update('deliveryType', type)}
                  className={`text-left rounded-2xl border px-4 py-3 transition-colors ${
                    active ? 'border-rose bg-blush' : 'border-petal-light hover:border-rose/50'
                  }`}
                >
                  <span className="block text-sm font-semibold text-plum">{label}</span>
                  <span className="block text-sm text-wine/60 mt-0.5">
                    {formatDA(wilayaFees[values.deliverySpeed][type])}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <label className="label-field" htmlFor="address">adresse de livraison *</label>
        <textarea
          id="address"
          className="input-field min-h-[80px] resize-none"
          value={values.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="numéro, rue, repère..."
        />
        {fieldError('address') && <p className="text-xs text-rose mt-1">{fieldError('address')}</p>}
      </div>

      <div>
        <label className="label-field" htmlFor="note">note (optionnel)</label>
        <textarea
          id="note"
          className="input-field min-h-[60px] resize-none"
          value={values.note}
          onChange={(e) => update('note', e.target.value)}
          placeholder="précisions pour la livraison..."
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full text-base py-4">
        {submitting && (
          <span className="w-4 h-4 rounded-full border-2 border-cream/40 border-t-cream animate-spin" />
        )}
        {submitting ? 'envoi en cours...' : 'confirmer la commande'}
      </button>
    </form>
  );
}
