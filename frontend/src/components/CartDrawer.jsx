import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useI18n } from '../context/I18nContext';
import { IconClose, IconBag, IconTrash, IconTag } from './icons';

export default function CartDrawer() {
  const { cartOpen, closeCart, openAuth } = useUI();
  const { items, subtotal, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!cartOpen) return null;

  function go(path) {
    closeCart();
    navigate(path);
  }

  function applyCoupon(e) {
    e.preventDefault();
    if (!coupon.trim()) return;
    setCouponMsg(t('invalid_coupon'));
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={closeCart} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl animate-[slideIn_.2s_ease-out] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <span className="font-display text-xl">{t('cart')}</span>
          <button onClick={closeCart} aria-label="Close" className="text-ink/50 hover:text-ink"><IconClose /></button>
        </div>

        {!user || items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10">
            <div className="w-24 h-24 rounded-full bg-mint/60 flex items-center justify-center mb-5">
              <IconBag width="36" height="36" className="text-forest" />
            </div>
            <p className="text-ink/60 text-lg mb-7">{t('cart_is_empty')}</p>
            <button onClick={() => go('/menu')} className="btn-primary w-full max-w-xs">{t('continue_shopping')}</button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-border text-base text-ink/70 shrink-0">
              {t('product')} ({items.length})
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="relative flex items-center gap-3.5 bg-mint/30 rounded-xl p-3.5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-mint shrink-0">
                    {i.image_url && <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-base truncate">{i.name}</span>
                      {i.category_name && (
                        <span className="bg-white text-ink/70 text-xs px-2 py-0.5 rounded-full shrink-0">{i.category_name}</span>
                      )}
                    </div>
                    <div className="text-sm text-ink/70 mb-2">{Number(i.price).toFixed(0)} Kd</div>
                    <div className="flex items-center border border-ink/15 rounded-full w-fit overflow-hidden">
                      <button type="button" onClick={() => updateItem(i.id, Math.max(1, i.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center bg-mint/60 hover:bg-mint text-ink text-sm">−</button>
                      <span className="w-7 text-center text-sm">{i.quantity}</span>
                      <button type="button" onClick={() => updateItem(i.id, i.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-forest text-white text-sm">+</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(i.id)} aria-label={t('remove')}
                    className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center">
                    <IconTrash width="14" height="14" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-border shrink-0 space-y-4">
              <form onSubmit={applyCoupon} className="space-y-2">
                <div className="text-sm font-medium text-ink/70">{t('coupon')}</div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconTag className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-ink/35" width="16" height="16" />
                    <input value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponMsg(''); }}
                      placeholder={t('enter_coupon')} className="field pl-10 rtl:pl-3 rtl:pr-10 py-2.5 text-sm" />
                  </div>
                  <button className="bg-forest text-white rounded-lg px-4 text-sm font-medium hover:bg-forest-dark transition">
                    {t('apply')}
                  </button>
                </div>
                {couponMsg && <p className="text-xs text-red-500">{couponMsg}</p>}
              </form>

              <p className="text-xs text-ink/50">{t('tax_shipping_note')}</p>

              <div className="flex items-center justify-between text-lg font-medium">
                <span>{t('total_price')}</span>
                <span className="text-forest">{subtotal.toFixed(0)} Kd</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => go('/menu')}
                  className="flex-1 bg-mint text-ink text-sm font-medium rounded-lg py-3 hover:bg-mint/70 transition">
                  {t('continue_shopping')}
                </button>
                <button onClick={() => go('/checkout')}
                  className="flex-1 bg-forest text-white text-sm font-medium rounded-lg py-3 hover:bg-forest-dark transition">
                  {t('checkout')}
                </button>
              </div>
            </div>
          </>
        )}

        {!user && (
          <div className="px-6 py-4 border-t border-border text-center text-sm shrink-0">
            <span className="text-ink/60">{t('no_account')} {t('to_complete_payment')}</span>{' '}
            <button onClick={() => { closeCart(); openAuth('login'); }} className="text-forest font-medium underline">{t('login')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
