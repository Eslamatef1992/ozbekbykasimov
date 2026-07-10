import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useI18n } from '../../context/I18nContext';
import { IconClose } from '../icons';

function statusLabel(status, t) {
  if (status === 'cancelled') return t('status_canceled');
  if (status === 'completed') return t('status_paid');
  return t('status_in_progress');
}

const paymentLabel = { cash: 'payment_cash', card: 'payment_card', paypal: 'payment_paypal' };

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function OrderDetailsDrawer({ orderId, onClose }) {
  const { t } = useI18n();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`).then((res) => setOrder(res.data));
  }, [orderId]);

  const discount = 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-xl animate-[slideIn_.2s_ease-out]">
        <div className="flex items-center justify-between px-7 py-6 border-b border-border">
          <h2 className="font-display text-xl">{t('order_details')}</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink/50 hover:text-ink"><IconClose /></button>
        </div>

        {!order ? (
          <p className="px-7 py-9 text-ink/50 text-base">{t('loading')}</p>
        ) : (
          <div className="px-7 py-8">
            <div className="flex items-center justify-between mb-8">
              <img src="/logo.svg" alt="Ozbek By Kasimov" className="h-10 w-auto" />
              <div className="text-right rtl:text-left">
                <div className="text-sm text-ink/50">{t('invoice_no')}</div>
                <div className="text-forest font-medium">#{order.id}</div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-base mb-8">
              <div>
                <dt className="text-sm text-ink/50 mb-1">{t('full_name')}:</dt>
                <dd className="font-medium">{order.customer_name}</dd>
              </div>
              <div className="text-right rtl:text-left">
                <dt className="text-sm text-ink/50 mb-1">{t('payment_method')}:</dt>
                <dd className="font-medium">{t(paymentLabel[order.payment_method] || 'payment_cash')}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink/50 mb-1">{t('phone_number')}:</dt>
                <dd className="font-medium">{order.contact_phone || '-'}</dd>
              </div>
              <div className="text-right rtl:text-left">
                <dt className="text-sm text-ink/50 mb-1">{t('date')}:</dt>
                <dd className="font-medium">{formatDate(order.created_at)}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink/50 mb-1">{t('address')}:</dt>
                <dd className="font-medium">{order.delivery_address ? `${order.delivery_address}, ${order.delivery_city || ''}` : '-'}</dd>
              </div>
              <div className="text-right rtl:text-left">
                <dt className="text-sm text-ink/50 mb-1">{t('order_status')}:</dt>
                <dd className="font-medium">{statusLabel(order.status, t)}</dd>
              </div>
            </dl>

            <h3 className="font-medium text-lg mb-4">{t('my_order')}</h3>
            <div className="border border-border rounded-xl overflow-hidden mb-8">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-mint/50 px-4 py-3 text-sm text-ink/60">
                <span>{t('product')}</span>
                <span>{t('qty')}</span>
                <span>{t('price')}</span>
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 border-t border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-mint shrink-0">
                      {item.image_url && <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-base truncate">{item.item_name}</span>
                  </div>
                  <span className="text-base">{item.quantity}</span>
                  <span className="text-base">{Number(item.line_total).toFixed(0)} Kd</span>
                </div>
              ))}
            </div>

            <div className="bg-mint/40 rounded-xl p-5">
              <h3 className="font-medium text-lg mb-4">{t('summary_order')}</h3>
              <div className="space-y-2.5 text-base">
                <div className="flex justify-between"><span className="text-ink/60">{t('subtotal')}</span><span>{Number(order.subtotal).toFixed(0)} Kd</span></div>
                <div className="flex justify-between"><span className="text-red-500">{t('delivery_fees')}</span><span className="text-red-500">{Number(order.delivery_fee).toFixed(2)} Kd</span></div>
                <div className="flex justify-between"><span className="text-red-500">{t('discount')}</span><span className="text-red-500">{discount.toFixed(2)} Kd</span></div>
                <div className="flex justify-between font-medium text-lg pt-3 border-t border-forest/15">
                  <span>{t('total_price')}</span><span className="text-forest">{Number(order.total).toFixed(0)} Kd</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
