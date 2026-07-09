import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];

export default function Orders() {
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
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-navy/20 rounded-lg px-3 py-2 mb-6">
        <option value="">All statuses</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="bg-white rounded-xl border border-navy/10 divide-y">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="font-medium">Order #{o.id} - {o.full_name}</div>
              <div className="text-sm text-navy/60">{o.email} - {new Date(o.created_at).toLocaleString()} - {o.fulfillment_type}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent font-medium">{Number(o.total).toFixed(0)} Kd</span>
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border border-navy/20 rounded-lg px-2 py-1 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="px-5 py-4 text-navy/50">No orders found.</p>}
      </div>
    </div>
  );
}
