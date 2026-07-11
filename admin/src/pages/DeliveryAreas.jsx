import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { Pencil, Power, Trash2, Truck } from 'lucide-react';

// Fixed list of Kuwait governorates - the same set already used for the
// customer's delivery address on the frontend (checkout / profile address
// tab). Admins pick from this list rather than typing a free-text name, so
// area names always stay consistent across the site; the only things an
// admin actually sets per area are the fee, sort order, and active state.
const KUWAIT_AREAS = [
  { name_en: 'Capital (Kuwait City)', name_ar: 'العاصمة (مدينة الكويت)' },
  { name_en: 'Hawalli', name_ar: 'حولي' },
  { name_en: 'Farwaniya', name_ar: 'الفروانية' },
  { name_en: 'Ahmadi', name_ar: 'الأحمدي' },
  { name_en: 'Jahra', name_ar: 'الجهراء' },
  { name_en: 'Mubarak Al-Kabeer', name_ar: 'مبارك الكبير' },
];

const emptyForm = { id: null, name_en: '', fee: '', sort_order: 0, is_active: true };

export default function DeliveryAreas() {
  const { t } = useI18n();
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function load() {
    api.get('/delivery-areas?all=true').then((res) => setAreas(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(a) {
    setForm({ id: a.id, name_en: a.name_en, fee: a.fee, sort_order: a.sort_order || 0, is_active: !!a.is_active });
  }

  // Areas not yet added, so the dropdown can't create duplicates.
  const availableAreas = KUWAIT_AREAS.filter((k) => !areas.some((a) => a.name_en === k.name_en));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const match = KUWAIT_AREAS.find((k) => k.name_en === form.name_en);
    if (!match) { setError('Please select an area'); return; }
    try {
      const payload = { name_en: match.name_en, name_ar: match.name_ar, fee: Number(form.fee) || 0, sort_order: Number(form.sort_order) || 0, is_active: form.is_active };
      if (form.id) await api.patch(`/delivery-areas/${form.id}`, payload);
      else await api.post('/delivery-areas', payload);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save delivery area');
    }
  }

  async function toggleActive(a) {
    await api.patch(`/delivery-areas/${a.id}`, { name_en: a.name_en, name_ar: a.name_ar, fee: a.fee, sort_order: a.sort_order, is_active: !a.is_active });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this delivery area?')) return;
    try {
      await api.delete(`/delivery-areas/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete delivery area');
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('delivery_title')}</h1>
          <p className="page-subtitle">{t('delivery_sub')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad mb-8 space-y-4 max-w-xl">
        <div>
          <label className="field-label">{t('region')}</label>
          <select
            required
            value={form.name_en}
            disabled={!!form.id}
            onChange={(e) => update('name_en', e.target.value)}
            className="field disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="" disabled>{t('choose_region')}</option>
            {form.id && <option value={form.name_en}>{form.name_en}</option>}
            {availableAreas.map((k) => <option key={k.name_en} value={k.name_en}>{k.name_en}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">{t('delivery_fee_kd')}</label>
            <input required type="number" step="0.01" placeholder="0.00" value={form.fee} onChange={(e) => update('fee', e.target.value)} className="field" />
          </div>
          <div>
            <label className="field-label">{t('sort_order')}</label>
            <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className="field" />
          </div>
        </div>

        {error && <p className="badge-danger">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button className="btn-primary">{form.id ? t('update_area') : t('add_area')}</button>
          {form.id && <button type="button" onClick={() => setForm(emptyForm)} className="btn-ghost">{t('cancel')}</button>}
        </div>
      </form>

      <div className="card overflow-hidden">
        {areas.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center text-forest shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <span className={a.is_active ? 'text-ink text-sm' : 'line-through text-muted text-sm'}>{a.name_en}{a.name_ar ? ` / ${a.name_ar}` : ''}</span>
                {!a.is_active && <span className="badge-neutral ml-2 rtl:ml-0 rtl:mr-2">{t('inactive')}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge-forest">{Number(a.fee).toFixed(2)} Kd</span>
              <div className="flex gap-1">
                <button onClick={() => edit(a)} className="btn-icon" aria-label={t('edit')}><Pencil size={15} /></button>
                <button onClick={() => toggleActive(a)} className="btn-icon" aria-label="Toggle active"><Power size={15} /></button>
                <button onClick={() => remove(a.id)} className="btn-icon hover:text-danger" aria-label={t('delete')}><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {areas.length === 0 && (
          <div className="empty-state">
            <Truck size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_areas_yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
