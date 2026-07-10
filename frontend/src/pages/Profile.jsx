import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  const statusLabel = {
    pending: t('status_pending'),
    confirmed: t('status_confirmed'),
    preparing: t('status_preparing'),
    out_for_delivery: t('status_out_for_delivery'),
    completed: t('status_completed'),
    cancelled: t('status_cancelled'),
  };

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
    api.get('/reservations/mine').then((res) => setReservations(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="page-heading mb-2">{t('my_profile')}</h1>
      <p className="text-ink/60 text-base mb-10">{user?.full_name} - {user?.email}</p>

      <h2 className="font-medium text-xl mb-5">{t('order_history')}</h2>
      <div className="space-y-3 mb-12">
        {orders.map((o) => (
          <div key={o.id} className="border border-border rounded-xl p-5 bg-white flex justify-between">
            <div>
              <div className="font-medium text-base">{t('order_number')} #{o.id}</div>
              <div className="text-sm text-ink/60">{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="text-right rtl:text-left">
              <div className="text-forest text-lg">{Number(o.total).toFixed(0)} Kd</div>
              <div className="text-sm text-ink/60">{statusLabel[o.status] || o.status}</div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-ink/50 text-base">{t('no_orders_yet')}</p>}
      </div>

      <h2 className="font-medium text-xl mb-5">{t('my_reservations')}</h2>
      <div className="space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className="border border-border rounded-xl p-5 bg-white flex justify-between">
            <div>
              <div className="font-medium text-base">{r.reservation_date} {t('at_time')} {r.reservation_time}</div>
              <div className="text-sm text-ink/60">{t('party_of')} {r.party_size}</div>
            </div>
            <div className="text-sm text-ink/60 self-center">{r.status}</div>
          </div>
        ))}
        {reservations.length === 0 && <p className="text-ink/50 text-base">{t('no_reservations_yet')}</p>}
      </div>
    </div>
  );
}
