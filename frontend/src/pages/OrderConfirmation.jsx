import { Link, useLocation, Navigate } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

// Shown after a guest completes checkout (logged-in users land on
// /profile?order=id instead, since they can see it in their order history).
// The order is passed via router state from Checkout.jsx - there's no public
// "look up my order" endpoint, so if someone lands here directly without
// that state we just send them home rather than guessing.
export default function OrderConfirmation() {
  const { state } = useLocation();
  const { t } = useI18n();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-mint/60 flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-forest">
          <path d="M5 12.5L9.5 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-display text-3xl text-forest mb-3">{t('order_confirmed_title')}</h1>
      <p className="text-ink/60 text-lg mb-6">{t('order_confirmed_body')}</p>
      <p className="text-base text-ink/70 mb-10">{t('order_number')}: <span className="font-medium text-ink">#{order.id}</span></p>
      <Link to="/menu" className="btn-primary inline-block">{t('back_to_menu')}</Link>
    </div>
  );
}
