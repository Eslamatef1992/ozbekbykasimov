import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusLabel = {
  pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for delivery', completed: 'Completed', cancelled: 'Cancelled',
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data));
    api.get('/reservations/mine').then((res) => setReservations(res.data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2">My Profile</h1>
      <p className="text-navy/60 mb-8">{user?.full_name} - {user?.email}</p>

      <h2 className="text-xl mb-4">Order History</h2>
      <div className="space-y-3 mb-10">
        {orders.map((o) => (
          <div key={o.id} className="border border-navy/10 rounded-xl p-4 bg-white flex justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-navy/60">{new Date(o.created_at).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-accent">{Number(o.total).toFixed(0)} Kd</div>
              <div className="text-sm text-navy/60">{statusLabel[o.status] || o.status}</div>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-navy/50">No orders yet.</p>}
      </div>

      <h2 className="text-xl mb-4">My Reservations</h2>
      <div className="space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className="border border-navy/10 rounded-xl p-4 bg-white flex justify-between">
            <div>
              <div className="font-medium">{r.reservation_date} at {r.reservation_time}</div>
              <div className="text-sm text-navy/60">Party of {r.party_size}</div>
            </div>
            <div className="text-sm text-navy/60 self-center">{r.status}</div>
          </div>
        ))}
        {reservations.length === 0 && <p className="text-navy/50">No reservations yet.</p>}
      </div>
    </div>
  );
}
