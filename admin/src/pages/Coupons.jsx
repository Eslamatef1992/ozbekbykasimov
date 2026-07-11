import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { Pencil, Trash2, Ticket } from 'lucide-react';

const emptyForm = { id: null, code: '', type: 'percent', value: '', min_order_value: '', max_uses: '', is_active: true, expires_at: '' };

export default function Coupons() {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function load() {
    api.get('/coupons').then((res) => setCoupons(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function edit(c) {
    setForm({
      id: c.id, code: c.code, type: c.type, value: c.value, min_order_value: c.min_order_value,
      max_uses: c.max_uses ?? '', is_active: !!c.is_active,
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        code: form.code, type: form.type, value: Number(form.value),
        min_order_value: form.min_order_value ? Number(form.min_order_value) : 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        is_active: form.is_active, expires_at: form.expires_at || null,
      };
      if (form.id) await api.patch(`/coupons/${form.id}`, payload);
      else await api.post('/coupons', payload);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save coupon');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    load();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('coupons_title')}</h1>
          <p className="page-subtitle">{coupons.length} {t('coupons_sub_count')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad mb-8 grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="field-label">{t('code')}</label>
          <input required placeholder="WELCOME10" value={form.code} onChange={(e) => update('code', e.target.value.toUpperCase())} className="field" />
        </div>
        <div>
          <label className="field-label">{t('discount_type')}</label>
          <select value={form.type} onChange={(e) => update('type', e.target.value)} className="field">
            <option value="percent">{t('percent_off')}</option>
            <option value="fixed">{t('fixed_off')}</option>
          </select>
        </div>
        <div>
          <label className="field-label">{t('value')}</label>
          <input required type="number" step="0.01" placeholder={form.type === 'percent' ? 'e.g. 10 for 10%' : 'Value in Kd'} value={form.value} onChange={(e) => update('value', e.target.value)} className="field" />
        </div>
        <div>
          <label className="field-label">{t('min_order_value')}</label>
          <input type="number" step="0.01" placeholder="0" value={form.min_order_value} onChange={(e) => update('min_order_value', e.target.value)} className="field" />
        </div>
        <div>
          <label className="field-label">{t('max_uses')}</label>
          <input type="number" placeholder={t('unlimited')} value={form.max_uses} onChange={(e) => update('max_uses', e.target.value)} className="field" />
        </div>
        <div>
          <label className="field-label">{t('expires')}</label>
          <input type="date" value={form.expires_at} onChange={(e) => update('expires_at', e.target.value)} className="field" />
        </div>
        <label className="flex items-center gap-2 text-sm h-[42px]">
          <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="accent-forest w-4 h-4" /> {t('active')}
        </label>

        {error && <p className="badge-danger md:col-span-3 w-fit">{error}</p>}

        <div className="md:col-span-3 flex gap-3">
          <button className="btn-primary">{form.id ? t('update_coupon') : t('add_coupon')}</button>
          {form.id && <button type="button" onClick={() => setForm(emptyForm)} className="btn-ghost">{t('cancel')}</button>}
        </div>
      </form>

      <div className="card overflow-hidden">
        {coupons.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition">
            <div>
              <div className={`text-sm font-medium flex items-center gap-2 ${c.is_active ? 'text-ink' : 'text-muted'}`}>
                {c.code} <span className="badge-forest">{c.type === 'percent' ? `${Number(c.value)}%` : `${Number(c.value).toFixed(0)} Kd`} {t('off')}</span>
                {!c.is_active && <span className="badge-neutral">{t('inactive')}</span>}
              </div>
              <div className="text-sm text-muted mt-1">
                {t('min_order')} {Number(c.min_order_value).toFixed(0)} Kd · {t('used')} {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                {c.expires_at ? ` · ${t('expires')} ${new Date(c.expires_at).toLocaleDateString()}` : ''}
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => edit(c)} className="btn-icon" aria-label={t('edit')}><Pencil size={15} /></button>
              <button onClick={() => remove(c.id)} className="btn-icon hover:text-danger" aria-label={t('delete')}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="empty-state">
            <Ticket size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_coupons_yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
