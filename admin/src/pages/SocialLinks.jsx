import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { CheckCircle2 } from 'lucide-react';

// Reuses the generic site_settings store, same as the CMS page - a link is
// shown on the website only when its URL is filled in.
const PLATFORMS = [
  ['social_facebook', 'Facebook', 'https://facebook.com/yourpage'],
  ['social_instagram', 'Instagram', 'https://instagram.com/yourpage'],
  ['social_x', 'X (Twitter)', 'https://x.com/yourpage'],
];

export default function SocialLinks() {
  const { t } = useI18n();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/settings').then((res) => setForm(res.data)); }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.put('/settings', form);
    setSaved(true);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('social_title')}</h1>
          <p className="page-subtitle">{t('social_sub')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card card-pad max-w-xl space-y-4">
        {PLATFORMS.map(([key, label, placeholder]) => (
          <div key={key}>
            <label className="field-label">{label}</label>
            <input value={form[key] || ''} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="field" />
          </div>
        ))}
        <div className="flex items-center gap-3 pt-1">
          <button className="btn-primary">{t('save_links')}</button>
          {saved && <span className="badge-success"><CheckCircle2 size={13} /> {t('saved')}</span>}
        </div>
      </form>
    </div>
  );
}
