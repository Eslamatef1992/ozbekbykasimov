import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';

export default function Contact() {
  const [settings, setSettings] = useState({});
  const { t } = useI18n();
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const rows = [
    [t('phone'), settings.contact_phone],
    [t('email'), settings.contact_email],
    [t('address'), settings.address],
    [t('hours'), settings.opening_hours],
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="section-label mb-5">{t('contact_us')}</div>
      <h1 className="page-heading mb-10">{t('get_in_touch')}</h1>
      <dl className="divide-y divide-border border border-border rounded-xl overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-6 py-5 text-base">
            <dt className="text-ink/50">{label}</dt>
            <dd className="text-ink font-medium">{value || 'TBD'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
