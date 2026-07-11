import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart, extrasTotal } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { IconCalendar, IconClock, IconChevron } from '../components/icons';
import { KnetBadge, MastercardBadge, VisaBadge, ApplePayBadge, SamsungPayBadge, CashBadge } from '../components/PaymentIcons';
import DatePickerPopover from '../components/DatePickerPopover';
import TimePickerPopover from '../components/TimePickerPopover';

const PAYMENT_METHODS = [
  { id: 'knet', label: 'payment_knet', Badge: KnetBadge, backend: 'card' },
  { id: 'mastercard', label: 'payment_mastercard', Badge: MastercardBadge, backend: 'card' },
  { id: 'visa', label: 'payment_visa', Badge: VisaBadge, backend: 'card' },
  { id: 'apple_pay', label: 'payment_apple_pay', Badge: ApplePayBadge, backend: 'card' },
  { id: 'samsung_pay', label: 'payment_samsung_pay', Badge: SamsungPayBadge, backend: 'card' },
  { id: 'cash', label: 'payment_cash', Badge: CashBadge, backend: 'cash' },
];

function formatDateLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Checkout() {
  const { items, subtotal, discount, coupon, clear, isGuest } = useCart();
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    contact_phone: '',
    delivery_type: 'my_address',
    delivery_area_id: '', block_number: '', street_name: '', building_number: '', floor: '', flat: '',
    date: '', time: '',
    payment: 'cash',
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/delivery-areas').then((res) => setAreas(res.data)).catch(() => {});
  }, []);

  function areaName(a) {
    return (locale === 'ar' && a.name_ar) ? a.name_ar : a.name_en;
  }

  const selectedArea = areas.find((a) => String(a.id) === String(form.delivery_area_id));
  const itemsTotal = items.reduce((sum, i) => sum + (Number(i.price) + extrasTotal(i.extras)) * i.quantity, 0);
  const fee = form.delivery_type === 'my_address' ? Number(selectedArea?.fee || 0) : 0;
  const total = Math.max(0, itemsTotal + fee - discount);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.delivery_type === 'my_address' && !form.delivery_area_id) {
      setError('Please select your delivery area');
      return;
    }
    if (form.delivery_type !== 'my_address' && (!form.date || !form.time)) {
      setError('Please select a date and time');
      return;
    }
    setSubmitting(true);
    try {
      const fulfillment_type = form.delivery_type === 'my_address' ? 'delivery' : form.delivery_type === 'dine_in' ? 'dine_in' : 'pickup';
      const method = PAYMENT_METHODS.find((p) => p.id === form.payment);
      const notesParts = [`Payment: ${t(method?.label || 'payment_cash')}`];

      let delivery_address = '';
      let delivery_city = '';

      if (form.delivery_type === 'my_address') {
        delivery_city = selectedArea ? areaName(selectedArea) : '';
        delivery_address = `Block ${form.block_number}, ${form.street_name} St, Building ${form.building_number}` +
          (form.floor ? `, Floor ${form.floor}` : '') + (form.flat ? `, Flat ${form.flat}` : '');
      } else {
        notesParts.push(`${form.delivery_type === 'dine_in' ? 'Dine-in' : 'Drive-thru'} date: ${formatDateLabel(form.date)}, time: ${form.time}`);
      }

      const payload = {
        fulfillment_type,
        payment_method: method?.backend || 'cash',
        delivery_address,
        delivery_city,
        delivery_area_id: form.delivery_type === 'my_address' ? form.delivery_area_id : undefined,
        delivery_notes: notesParts.join(' | '),
        contact_phone: form.contact_phone,
        coupon_code: coupon?.code || undefined,
      };

      if (isGuest) {
        payload.guest_name = form.full_name;
        payload.guest_email = form.email;
        payload.guest_phone = form.contact_phone;
        payload.items = items.map((i) => ({
          menu_item_id: i.menu_item_id, quantity: i.quantity, extras: (i.extras || []).map((e) => e.id),
        }));
      }

      const { data } = await api.post('/orders', payload);
      await clear();
      if (isGuest) {
        navigate('/order-confirmation', { state: { order: data } });
      } else {
        navigate(`/profile?order=${data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-lg text-ink/60">{t('cart_empty')}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex items-center gap-2 text-sm text-ink/50 mb-8 flex-wrap">
        <Link to="/menu" className="hover:text-forest">{t('menu_title')}</Link>
        <IconChevron className="rtl:rotate-180" width="14" height="14" />
        <Link to="/cart" className="hover:text-forest">{t('cart')}</Link>
        <IconChevron className="rtl:rotate-180" width="14" height="14" />
        <span className="text-ink">{t('checkout')}</span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-3">
        <span className="h-px w-10 bg-forest/40" />
        <h1 className="font-display text-2xl sm:text-3xl text-forest">{t('checkout')}</h1>
        <span className="h-px w-10 bg-forest/40" />
      </div>
      {isGuest && (
        <p className="text-center text-sm text-ink/50 mb-7">{t('checking_out_as_guest')} — {t('guest_checkout_hint')}</p>
      )}
      {!isGuest && <div className="mb-10" />}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-2xl mb-6">{t('checkout')}</h2>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <Field label={t('name')} required>
              <input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
                placeholder={t('enter_name')} className="field" />
            </Field>
            <Field label={t('email')} required={isGuest}>
              <input type="email" required={isGuest} value={form.email} onChange={(e) => update('email', e.target.value)}
                placeholder={t('enter_mail')} className="field" />
            </Field>
          </div>

          <Field label={t('phone_number')} required>
            <div className="flex mb-7">
              <span className="flex items-center gap-1.5 px-3 border border-r-0 rtl:border-r rtl:border-l-0 border-ink/15 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg text-base text-ink/70 bg-mint/40">
                🇰🇼 +965
              </span>
              <input required value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)}
                placeholder={t('enter_phone')} className="field rounded-l-none rtl:rounded-l-lg rtl:rounded-r-none" />
            </div>
          </Field>

          <div className="border-t border-border pt-6">
            <h3 className="font-medium text-base mb-4">{t('delivery_type')}</h3>
            <div className="flex flex-wrap gap-6 mb-6">
              {[['my_address', t('my_address')], ['dine_in', t('dine_in')], ['drive_thru', t('drive_thru')]].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer text-base">
                  <input type="radio" name="delivery_type" checked={form.delivery_type === value}
                    onChange={() => update('delivery_type', value)} className="w-4 h-4 accent-forest" />
                  {label}
                </label>
              ))}
            </div>

            {form.delivery_type === 'my_address' ? (
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t('region')} required>
                  <select required value={form.delivery_area_id} onChange={(e) => update('delivery_area_id', e.target.value)} className="field">
                    <option value="" disabled>{t('choose_region')}</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{areaName(a)} — {Number(a.fee).toFixed(2)} Kd</option>
                    ))}
                  </select>
                </Field>
                <Field label={t('block_number')} required>
                  <input required value={form.block_number} onChange={(e) => update('block_number', e.target.value)}
                    placeholder={t('enter_number')} className="field" />
                </Field>
                <Field label={t('street_name')} required>
                  <input required value={form.street_name} onChange={(e) => update('street_name', e.target.value)}
                    placeholder={t('enter_name')} className="field" />
                </Field>
                <Field label={t('building_number')} required>
                  <input required value={form.building_number} onChange={(e) => update('building_number', e.target.value)}
                    placeholder={t('enter_number')} className="field" />
                </Field>
                <Field label={t('floor')}>
                  <input value={form.floor} onChange={(e) => update('floor', e.target.value)}
                    placeholder={t('enter_floor')} className="field" />
                </Field>
                <Field label={t('flat')}>
                  <input value={form.flat} onChange={(e) => update('flat', e.target.value)}
                    placeholder={t('enter_flat')} className="field" />
                </Field>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t('date')} required>
                  <div className="relative">
                    <button type="button" onClick={() => { setDatePickerOpen((o) => !o); setTimePickerOpen(false); }}
                      className="field flex items-center justify-between text-left rtl:text-right">
                      <span className={form.date ? 'text-ink' : 'text-ink/35'}>{form.date ? formatDateLabel(form.date) : t('select_date')}</span>
                      <IconCalendar className="text-ink/40" />
                    </button>
                    {datePickerOpen && (
                      <DatePickerPopover value={form.date} onSelect={(d) => update('date', d)} onClose={() => setDatePickerOpen(false)} />
                    )}
                  </div>
                </Field>
                <Field label={t('time')} required>
                  <div className="relative">
                    <button type="button" onClick={() => { setTimePickerOpen((o) => !o); setDatePickerOpen(false); }}
                      className="field flex items-center justify-between text-left rtl:text-right">
                      <span className={form.time ? 'text-ink' : 'text-ink/35'}>{form.time || t('enter_time')}</span>
                      <IconClock className="text-ink/40" />
                    </button>
                    {timePickerOpen && (
                      <TimePickerPopover value={form.time} onSelect={(v) => update('time', v)} onClose={() => setTimePickerOpen(false)} />
                    )}
                  </div>
                </Field>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-base mt-6">{error}</p>}
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-medium text-lg mb-3 pb-3 border-b border-border">{t('payments_methods')}</h2>
            <div className="divide-y divide-border">
              {PAYMENT_METHODS.map(({ id, label, Badge }) => (
                <label key={id} className="flex items-center gap-3 py-3 cursor-pointer">
                  <Badge />
                  <span className="flex-1 text-base">{t(label)}</span>
                  <input type="radio" name="payment" checked={form.payment === id}
                    onChange={() => update('payment', id)} className="w-4 h-4 accent-forest" />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-medium text-lg mb-4">{t('cart_totals')}</h2>
            <div className="space-y-2.5 text-base">
              <div className="flex justify-between"><span className="text-ink/60">{t('subtotal')}</span><span>{itemsTotal.toFixed(2)} Kd</span></div>
              {form.delivery_type === 'my_address' && (
                <div className="flex justify-between"><span className="text-ink/60">{t('delivery_fees')}</span><span>{fee.toFixed(0)} Kd</span></div>
              )}
              {discount > 0 && (
                <div className="flex justify-between"><span className="text-red-500">{t('coupon_discount')}</span><span className="text-red-500">-{discount.toFixed(2)} Kd</span></div>
              )}
              <div className="flex justify-between font-medium text-lg pt-3 border-t border-border">
                <span>{t('total')}</span><span className="text-forest">{total.toFixed(2)} Kd</span>
              </div>
            </div>
            <button disabled={submitting}
              className="w-full bg-forest text-white rounded-lg py-3.5 font-medium hover:bg-forest-dark transition disabled:opacity-50 mt-5">
              {submitting ? '...' : t('place_order')}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-base font-medium text-ink mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
