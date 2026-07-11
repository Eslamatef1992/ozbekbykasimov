import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { Pencil, Trash2, Layers } from 'lucide-react';

const emptyForm = { id: null, name_en: '', name_ar: '', price: '', is_available: true };

export default function Extras() {
  const { t } = useI18n();
  const [extras, setExtras] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function load() {
    api.get('/extras?all=true').then((res) => setExtras(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(x) {
    setForm({ id: x.id, name_en: x.name_en, name_ar: x.name_ar || '', price: x.price, is_available: !!x.is_available });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { name_en: form.name_en, name_ar: form.name_ar, price: Number(form.price) || 0, is_available: form.is_available };
      if (form.id) await api.patch(`/extras/${form.id}`, payload);
      else await api.post('/extras', payload);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save extra');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this extra?')) return;
    await api.delete(`/extras/${id}`);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('extras_title')}</h1>
          <p className="page-subtitle">{t('extras_sub')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad mb-8 grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="field-label">{t('name_english')}</label>
          <input required placeholder="e.g. Extra Cheese" value={form.name_en} onChange={(e) => update('name_en', e.target.value)} className="field" />
        </div>
        <div>
          <label className="field-label">{t('name_arabic')}</label>
          <input placeholder="مثال: جبنة إضافية" dir="rtl" value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} className="field" />
        </div>
        <div>
          <label className="field-label">{t('price_kd')}</label>
          <input required type="number" step="0.01" placeholder="0.00" value={form.price} onChange={(e) => update('price', e.target.value)} className="field" />
        </div>
        <label className="flex items-center gap-2 text-sm h-[42px]">
          <input type="checkbox" checked={form.is_available} onChange={(e) => update('is_available', e.target.checked)} className="accent-forest w-4 h-4" /> {t('available')}
        </label>

        {error && <p className="badge-danger md:col-span-4 w-fit">{error}</p>}

        <div className="md:col-span-4 flex gap-3">
          <button className="btn-primary">{form.id ? t('update_extra') : t('add_extra')}</button>
          {form.id && <button type="button" onClick={() => setForm(emptyForm)} className="btn-ghost">{t('cancel')}</button>}
        </div>
      </form>

      <div className="card overflow-hidden">
        {extras.map((x) => (
          <div key={x.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div>
              <div className={`text-sm ${x.is_available ? 'text-ink' : 'text-muted line-through'}`}>{x.name_en}{x.name_ar ? ` / ${x.name_ar}` : ''}</div>
              <div className="text-sm text-muted mt-0.5">{Number(x.price).toFixed(2)} Kd</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => edit(x)} className="btn-icon" aria-label={t('edit')}><Pencil size={15} /></button>
              <button onClick={() => remove(x.id)} className="btn-icon hover:text-danger" aria-label={t('delete')}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {extras.length === 0 && (
          <div className="empty-state">
            <Layers size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_extras_yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
