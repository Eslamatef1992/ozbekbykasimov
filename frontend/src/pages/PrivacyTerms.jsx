import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';

export default function PrivacyTerms() {
  const [settings, setSettings] = useState({});
  const { t, locale } = useI18n();
  useEffect(() => { api.get('/settings').then((res) => setSettings(res.data)); }, []);

  const body = (locale === 'ar' && settings.privacy_body_ar) ? settings.privacy_body_ar : settings.privacy_body;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="page-heading mb-7">{t('privacy_terms_title')}</h1>
      <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-line">
        {body || t('privacy_terms_placeholder')}
      </p>
    </div>
  );
}
