import { useEffect, useState } from 'react';
import api from '../services/api';
import { resolveImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';
import { ImagePlus, CheckCircle2 } from 'lucide-react';

// Site content (CMS). Reuses the generic site_settings key/value store -
// each field below maps to one key, and the customer site fetches the same
// GET /api/settings the pages already consume, with a fallback to the
// current hardcoded design when a field hasn't been set yet.
const GROUPS = [
  {
    titleKey: 'group_contact',
    subtitleKey: 'group_contact_sub',
    fields: [
      ['site_name', 'text', 'field_site_name'],
      ['contact_phone', 'text', 'field_contact_phone'],
      ['contact_email', 'text', 'field_contact_email'],
      ['address', 'text', 'field_address'],
    ],
  },
  {
    titleKey: 'group_about',
    fields: [
      ['about_text', 'bilingual_textarea', 'field_about_intro'],
      ['about_coffee_text', 'bilingual_textarea', 'field_about_coffee'],
      ['about_reservation_photo', 'image', 'field_about_photo'],
    ],
  },
  {
    titleKey: 'group_privacy',
    fields: [
      ['privacy_body', 'bilingual_textarea', 'field_privacy_body'],
    ],
  },
];

export default function Settings() {
  const { t } = useI18n();
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');

  useEffect(() => { api.get('/settings').then((res) => setForm(res.data)); }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleUpload(key, e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      update(key, data.url);
    } finally {
      setUploadingKey('');
    }
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
          <h1 className="page-title">{t('cms_title')}</h1>
          <p className="page-subtitle">{t('cms_sub')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {GROUPS.map((group) => (
          <div key={group.titleKey} className="card card-pad space-y-4">
            <div>
              <h2 className="font-semibold text-ink">{t(group.titleKey)}</h2>
              {group.subtitleKey && <p className="text-sm text-muted mt-0.5">{t(group.subtitleKey)}</p>}
            </div>
            {group.fields.map(([key, type, labelKey]) => (
              <div key={key}>
                <label className="field-label">{t(labelKey)}</label>
                {type === 'text' && (
                  <input value={form[key] || ''} onChange={(e) => update(key, e.target.value)} className="field" />
                )}
                {type === 'bilingual_textarea' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <textarea value={form[key] || ''} onChange={(e) => update(key, e.target.value)} rows={4}
                      placeholder="English" className="field" />
                    <textarea value={form[`${key}_ar`] || ''} onChange={(e) => update(`${key}_ar`, e.target.value)} rows={4}
                      dir="rtl" placeholder="العربية" className="field" />
                  </div>
                )}
                {type === 'image' && (
                  <div className="flex items-center gap-3">
                    {form[key] ? (
                      <img src={resolveImageUrl(form[key])} alt="" className="w-16 h-16 rounded-lg object-cover border border-line" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-surface flex items-center justify-center text-muted"><ImagePlus size={18} /></div>
                    )}
                    <label className="btn-secondary cursor-pointer text-sm">
                      {uploadingKey === key ? t('uploading') : t('choose_image')}
                      <input type="file" accept="image/*" onChange={(e) => handleUpload(key, e)} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button className="btn-primary">{t('save_content')}</button>
          {saved && <span className="badge-success"><CheckCircle2 size={13} /> {t('saved')}</span>}
        </div>
      </form>
    </div>
  );
}
