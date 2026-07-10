import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useI18n } from '../context/I18nContext';
import { IconTrash, IconTag, IconChevron } from '../components/icons';
import { resolveImageUrl } from '../utils/media';

export default function Cart() {
  const { items, subtotal, updateItem, removeItem } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  function applyCoupon(e) {
    e.preventDefault();
    if (!coupon.trim()) return;
    setCouponMsg(t('invalid_coupon') || 'Coupon not valid');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center gap-2 text-sm text-ink/50 mb-8">
        <Link to="/" className="hover:text-forest">{t('nav_home')}</Link>
        <IconChevron className="rtl:rotate-180" width="14" height="14" />
        <span className="text-ink">{t('cart')}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="h-px w-10 bg-forest/40" />
        <h1 className="font-display text-2xl sm:text-3xl text-forest">{t('cart')}</h1>
        <span className="h-px w-10 bg-forest/40" />
      </div>

      {items.length === 0 ? (
        <p className="text-ink/60 text-lg text-center py-10">{t('cart_empty')} <Link to="/menu" className="text-forest">{t('browse_menu')}</Link>.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 sm:p-7">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
              <span className="text-base font-medium">{t('cart')} ({items.length})</span>
              <Link to="/menu" className="text-sm text-ink/70 underline hover:text-forest">{t('continue_shopping')}</Link>
            </div>

            <div className="space-y-4">
              {items.map((i) => (
                <div key={i.id} className="relative flex items-center gap-4 bg-mint/30 rounded-xl p-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-mint shrink-0">
                    {i.image_url && <img src={resolveImageUrl(i.image_url)} alt={i.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-medium text-base truncate">{i.name}</span>
                      {i.category_name && (
                        <span className="bg-white text-ink/70 text-xs px-2.5 py-1 rounded-full shrink-0">{i.category_name}</span>
                      )}
                    </div>
                    <div className="text-base text-ink/70 mb-3">{Number(i.price).toFixed(0)} Kd</div>
                    <div className="flex items-center border border-ink/15 rounded-full w-fit overflow-hidden">
                      <button type="button" onClick={() => updateItem(i.id, Math.max(1, i.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-mint/60 hover:bg-mint text-ink">−</button>
                      <span className="w-8 text-center text-base">{i.quantity}</span>
                      <button type="button" onClick={() => updateItem(i.id, i.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-forest text-white hover:bg-forest-dark">+</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(i.id)} aria-label={t('remove')}
                    className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center">
                    <IconTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-medium text-lg mb-4">{t('coupon')}</h2>
              <form onSubmit={applyCoupon} className="space-y-3">
                <div className="relative">
                  <IconTag className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
                  <input value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponMsg(''); }}
                    placeholder={t('enter_coupon')} className="field pl-10 rtl:pl-4 rtl:pr-10" />
                </div>
                {couponMsg && <p className="text-sm text-red-500">{couponMsg}</p>}
                <button className="w-full bg-forest text-white rounded-lg py-3 font-medium hover:bg-forest-dark transition">
                  {t('apply')}
                </button>
              </form>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-medium text-lg mb-4">{t('cart_totals')}</h2>
              <div className="space-y-2.5 text-base">
                <div className="flex justify-between"><span className="text-ink/60">{t('subtotal')}</span><span>{subtotal.toFixed(0)} Kd</span></div>
                <div className="flex justify-between"><span className="text-red-500">{t('coupon_discount')}</span><span className="text-red-500">0 Kd</span></div>
                <div className="flex justify-between font-medium text-lg pt-3 border-t border-border">
                  <span>{t('total')}</span><span className="text-forest">{subtotal.toFixed(0)} Kd</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')}
                className="w-full bg-forest text-white rounded-lg py-3.5 font-medium hover:bg-forest-dark transition mt-5">
                {t('proceed_checkout')}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
