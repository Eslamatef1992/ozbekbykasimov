import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, extrasTotal } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useI18n } from '../context/I18nContext';
import { IconClose, IconBag, IconTrash, IconTag } from './icons';
import { resolveImageUrl } from '../utils/media';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { items, subtotal, discount, coupon, couponError, applyCoupon, clearCoupon, updateItem, removeItem, isGuest } = useCart();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!cartOpen) return null;

  function go(path) {
    closeCart();
    navigate(path);
  }

  async function handleApplyCoupon(e) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      await applyCoupon(couponInput.trim());
    } catch {
      // couponError from context already reflects the failure
    } finally {
      setApplying(false);
    }
  }

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={closeCart} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl animate-[slideIn_.2s_ease-out] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <span className="font-display text-xl">{t('cart')}</span>
          <button onClick={closeCart} aria-label="Close" className="text-ink/50 hover:text-ink"><IconClose /></button>
        </div>

        {items.length === 0 ? (
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
              {items.map((i) => {
                const name = (locale === 'ar' && i.name_ar) ? i.name_ar : i.name;
                const lineExtras = extrasTotal(i.extras);
                return (
                  <div key={i.id} className="relative flex items-center gap-3.5 bg-mint/30 rounded-xl p-3.5">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-mint shrink-0">
                      {i.image_url && <img src={resolveImageUrl(i.image_url)} alt={name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-base truncate">{name}</span>
                        {i.category_name && (
                          <span className="bg-white text-ink/70 text-xs px-2 py-0.5 rounded-full shrink-0">{i.category_name}</span>
                        )}
                      </div>
                      <div className="text-sm text-ink/70 mb-1">{(Number(i.price) + lineExtras).toFixed(2)} Kd</div>
                      {i.extras && i.extras.length > 0 && (
                        <div className="text-xs text-ink/50 mb-1.5">
                          + {i.extras.map((e) => (locale === 'ar' && e.name_ar) ? e.name_ar : e.name_en).join(', ')}
                        </div>
                      )}
                      <div className="flex items-center border border-ink/15 rounded-full w-fit overflow-hidden mt-1">
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
                );
              })}
            </div>

            <div className="px-6 py-5 border-t border-border shrink-0 space-y-4">
              {coupon ? (
                <div className="flex items-center justify-between bg-mint/40 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-forest">{coupon.code} {t('applied')}</span>
                  <button type="button" onClick={() => { clearCoupon(); setCouponInput(''); }} className="text-xs text-ink/50 underline">{t('remove')}</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="text-sm font-medium text-ink/70">{t('coupon')}</div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <IconTag className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-ink/35" width="16" height="16" />
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t('enter_coupon')} className="field pl-10 rtl:pl-3 rtl:pr-10 py-2.5 text-sm" />
                    </div>
                    <button disabled={applying} className="bg-forest text-white rounded-lg px-4 text-sm font-medium hover:bg-forest-dark transition disabled:opacity-50">
                      {applying ? '...' : t('apply')}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                </form>
              )}

              <p className="text-xs text-ink/50">{t('tax_shipping_note')}</p>

              <div className="flex items-center justify-between text-lg font-medium">
                <span>{t('total_price')}</span>
                <span className="text-forest">{total.toFixed(2)} Kd</span>
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

              {isGuest && (
                <p className="text-xs text-center text-ink/50">{t('guest_checkout_hint')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
