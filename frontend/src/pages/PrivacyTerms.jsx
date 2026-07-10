import { useI18n } from '../context/I18nContext';

export default function PrivacyTerms() {
  const { t } = useI18n();
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="page-heading mb-7">{t('privacy_terms_title')}</h1>
      <p className="text-ink/70 text-lg leading-relaxed">
        {t('privacy_terms_placeholder')}
      </p>
    </div>
  );
}
