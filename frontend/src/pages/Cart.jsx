import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';

export default function Cart() {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="page-heading mb-10">{t('your_cart')}</h1>

      {items.length === 0 ? (
        <p className="text-ink/60 text-lg">{t('cart_empty')} <Link to="/menu" className="text-forest">{t('browse_menu')}</Link>.</p>
      ) : (
        <div className="space-y-5">
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between border border-border rounded-xl p-5 bg-white">
              <div>
                <div className="font-medium text-lg">{i.name}</div>
                <div className="text-base text-ink/60">{Number(i.price).toFixed(0)} Kd each</div>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center border border-ink/20 rounded-full">
                  <button onClick={() => updateItem(i.id, Math.max(1, i.quantity - 1))} className="px-3.5 py-1.5">-</button>
                  <span className="px-3">{i.quantity}</span>
                  <button onClick={() => updateItem(i.id, i.quantity + 1)} className="px-3.5 py-1.5">+</button>
                </div>
                <div className="w-24 text-right text-lg">{(Number(i.price) * i.quantity).toFixed(0)} Kd</div>
                <button onClick={() => removeItem(i.id)} className="text-ink/40 hover:text-forest">&times;</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-8 border-t border-border">
            <div className="text-xl">{t('subtotal')}: <span className="text-forest font-medium">{subtotal.toFixed(0)} Kd</span></div>
            <button onClick={() => navigate('/checkout')} className="btn-primary">{t('proceed_checkout')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
