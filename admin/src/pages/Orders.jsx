import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { openReceipt } from '../utils/receipt';
import { ShoppingBag, Printer } from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];

const STATUS_BADGE = {
  pending: 'badge-warning',
  confirmed: 'badge-forest',
  preparing: 'badge-forest',
  out_for_delivery: 'badge-forest',
  completed: 'badge-success',
  cancelled: 'badge-danger',
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString();
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function addressOf(o, t) {
  if (o.fulfillment_type === 'pickup') return t('pickup');
  if (o.fulfillment_type === 'dine_in') return t('dine_in');
  if (o.delivery_address) return `${o.delivery_address}${o.delivery_city ? `, ${o.delivery_city}` : ''}`;
  return '—';
}

function printOrder(o, t) {
  const itemsRows = (o.items || []).map((it) => `
    <tr>
      <td>${it.item_name} × ${it.quantity}${it.extras?.length ? `<div style="color:#6B7A73;font-size:11px;">+ ${it.extras.map((e) => e.name_en || e.name).join(', ')}</div>` : ''}</td>
      <td style="text-align:right">${Number(it.line_total).toFixed(2)} Kd</td>
    </tr>`).join('');

  const tableHtml = `
    <table>
      ${itemsRows}
      ${o.discount_amount > 0 ? `<tr><td>Discount ${o.coupon_code ? `(${o.coupon_code})` : ''}</td><td style="text-align:right">−${Number(o.discount_amount).toFixed(2)} Kd</td></tr>` : ''}
      <tr class="total-row"><td>Total</td><td style="text-align:right">${Number(o.total).toFixed(2)} Kd</td></tr>
    </table>`;

  openReceipt({
    title: `Order #${o.id}`,
    subtitle: `Order #${o.id} — ${fmtDate(o.created_at)} at ${fmtTime(o.created_at)}`,
    rows: [
      ['Customer', o.full_name || 'Guest'],
      ['Phone', o.client_phone],
      ['Email', o.email],
      ['Address', addressOf(o, t)],
      ['Status', o.status.replace(/_/g, ' ')],
    ],
    tableHtml,
    showThanks: true,
  });
}

export default function Orders() {
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  function load() {
    api.get('/orders', { params: filter ? { status: filter } : {} }).then((res) => setOrders(res.data));
  }
  useEffect(load, [filter]);

  async function updateStatus(id, status) {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('orders_title')}</h1>
          <p className="page-subtitle">{orders.length} {t('orders_sub_count')}{filter ? ` · ${filter.replace(/_/g, ' ')}` : ''}</p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field w-auto">
            <option value="">{t('all_statuses')}</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button onClick={() => window.print()} className="btn-secondary"><Printer size={16} /> {t('print_report')}</button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('col_order_no')}</th>
              <th>{t('col_client_phone')}</th>
              <th>{t('col_email')}</th>
              <th>{t('col_address')}</th>
              <th>{t('col_order_details')}</th>
              <th>{t('col_status')}</th>
              <th>{t('col_date')}</th>
              <th>{t('col_time')}</th>
              <th className="no-print">{t('print')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="font-medium text-ink whitespace-nowrap">
                  #{o.id}
                  <div className="flex gap-1 mt-1">
                    {Number(o.is_guest) === 1 && <span className="badge-warning">{t('guest')}</span>}
                    {o.coupon_code && <span className="badge-success">{o.coupon_code}</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap">{o.client_phone || '—'}</td>
                <td className="whitespace-nowrap">{o.email || '—'}</td>
                <td className="max-w-[180px]">{addressOf(o, t)}</td>
                <td className="min-w-[220px] max-w-[320px]">
                  <ul className="text-sm space-y-0.5">
                    {(o.items || []).map((it, idx) => (
                      <li key={idx} className="text-ink/80">
                        {it.item_name} <span className="text-muted">× {it.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-forest font-semibold text-sm mt-1">{Number(o.total).toFixed(2)} Kd</div>
                </td>
                <td className="whitespace-nowrap">
                  <span className={`${STATUS_BADGE[o.status] || 'badge-neutral'} mb-1.5`}>{o.status.replace(/_/g, ' ')}</span>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="field py-1 px-2 text-xs block mt-1.5 no-print">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </td>
                <td className="whitespace-nowrap text-sm">{fmtDate(o.created_at)}</td>
                <td className="whitespace-nowrap text-sm">{fmtTime(o.created_at)}</td>
                <td className="no-print">
                  <button onClick={() => printOrder(o, t)} className="btn-icon" aria-label="Print order"><Printer size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="empty-state">
            <ShoppingBag size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_orders_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
