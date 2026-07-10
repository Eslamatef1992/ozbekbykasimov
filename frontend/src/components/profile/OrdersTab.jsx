import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useI18n } from '../../context/I18nContext';
import { IconBoxEmpty } from '../icons';
import OrderDetailsDrawer from './OrderDetailsDrawer';

function statusInfo(status, t) {
  if (status === 'cancelled') return { label: t('status_canceled'), dot: 'bg-red-500', text: 'text-red-500' };
  if (status === 'completed') return { label: t('status_paid'), dot: 'bg-forest', text: 'text-forest' };
  return { label: t('status_in_progress'), dot: 'bg-sky-500', text: 'text-sky-500' };
}

export default function OrdersTab() {
  const { t } = useI18n();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [reordering, setReordering] = useState(null);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
  }, []);

  async function handleReorder(order) {
    setReordering(order.id);
    try {
      for (const item of order.items) {
        await addItem(item.menu_item_id, item.quantity);
      }
      navigate('/cart');
    } finally {
      setReordering(null);
    }
  }

  if (orders === null) {
    return <p className="text-ink/50 text-base">{t('loading')}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <IconBoxEmpty className="text-forest mb-5" />
        <h2 className="font-display text-2xl mb-2">{t('no_items_found')}</h2>
        <p className="text-ink/50 text-base max-w-sm">{t('no_items_found_sub')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-6">
        {orders.map((order) => {
          const first = order.items?.[0];
          const st = statusInfo(order.status, t);
          const canReorder = order.status === 'completed';
          return (
            <div key={order.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <span className="text-base text-ink/60">{t('order_id')}: <span className="text-ink font-medium">#{order.id}</span></span>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>

              {first && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-mint shrink-0">
                    {first.image_url && <img src={first.image_url} alt={first.item_name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-tag text-forest text-xs px-2.5 py-1 rounded-full mb-1">
                      {first.category_name || t('main_meal')}
                    </span>
                    <div className="font-medium text-base truncate">{first.item_name}</div>
                  </div>
                  <div className="text-base font-medium shrink-0">{Number(first.line_total).toFixed(0)} Kd</div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setOpenOrderId(order.id)}
                  className="flex-1 bg-mint text-ink text-base font-medium rounded-lg py-3 hover:bg-mint/70 transition">
                  {t('view')}
                </button>
                {canReorder && (
                  <button onClick={() => handleReorder(order)} disabled={reordering === order.id}
                    className="flex-1 bg-mint text-ink text-base font-medium rounded-lg py-3 hover:bg-mint/70 transition disabled:opacity-50">
                    {reordering === order.id ? '...' : t('re_order')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openOrderId && <OrderDetailsDrawer orderId={openOrderId} onClose={() => setOpenOrderId(null)} />}
    </>
  );
}
