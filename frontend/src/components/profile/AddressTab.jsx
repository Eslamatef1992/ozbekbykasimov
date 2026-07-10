import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useI18n } from '../../context/I18nContext';
import { IconChevron } from '../icons';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-base font-medium text-ink mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const REGION_KEYS = ['region_capital', 'region_hawalli', 'region_farwaniya', 'region_ahmadi', 'region_jahra', 'region_mubarak'];

export default function AddressTab() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    region: '', block_number: '', street_name: '', building_number: '', floor: '', flat: '',
  });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/users/me').then((res) => {
      const u = res.data;
      setForm({
        region: u.region || '',
        block_number: u.block_number || '',
        street_name: u.street_name || '',
        building_number: u.building_number || '',
        floor: u.floor || '',
        flat: u.flat || '',
      });
    });
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('');
    setSaving(true);
    try {
      await api.patch('/users/me/address', form);
      setStatus(t('address_saved'));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-8">
      <h2 className="font-display text-2xl mb-5 pb-5 border-b border-border">{t('address_title')}</h2>
      <div className="space-y-6">
        <Field label={t('region')} required>
          <div className="relative">
            <select required value={form.region} onChange={(e) => update('region', e.target.value)}
              className="field appearance-none pr-10 rtl:pr-4 rtl:pl-10">
              <option value="" disabled>{t('choose_region')}</option>
              {REGION_KEYS.map((key) => (
                <option key={key} value={key}>{t(key)}</option>
              ))}
            </select>
            <IconChevron dir="down" className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none rotate-90" />
          </div>
        </Field>
        <Field label={t('block_number')} required>
          <input required value={form.block_number} onChange={(e) => update('block_number', e.target.value)}
            placeholder={t('enter_number')} className="field" />
        </Field>
        <Field label={t('street_name')} required>
          <input required value={form.street_name} onChange={(e) => update('street_name', e.target.value)}
            placeholder={t('enter_name')} className="field" />
        </Field>
        <Field label={t('building_number')} required>
          <input required value={form.building_number} onChange={(e) => update('building_number', e.target.value)}
            placeholder={t('enter_number')} className="field" />
        </Field>
        <Field label={t('floor')}>
          <input value={form.floor} onChange={(e) => update('floor', e.target.value)}
            placeholder={t('enter_floor')} className="field" />
        </Field>
        <Field label={t('flat')}>
          <input value={form.flat} onChange={(e) => update('flat', e.target.value)}
            placeholder={t('enter_flat')} className="field" />
        </Field>

        {error && <p className="text-red-600 text-base">{error}</p>}
        {status && <p className="text-forest text-base">{status}</p>}
        <button disabled={saving} className="w-full bg-forest text-white rounded-lg py-3.5 font-medium hover:bg-forest-dark transition disabled:opacity-50">
          {saving ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  );
}
