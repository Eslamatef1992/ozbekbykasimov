import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="max-w-xl mx-auto px-6 py-28 text-center">
      <h1 className="font-display text-5xl mb-5">404</h1>
      <p className="text-ink/60 text-lg mb-7">{t('page_not_found')}</p>
      <Link to="/" className="text-forest text-base font-medium underline">{t('back_home')}</Link>
    </div>
  );
}
