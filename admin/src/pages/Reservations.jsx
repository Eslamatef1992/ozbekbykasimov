import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  function load() {
    api.get('/reservations').then((res) => setReservations(res.data));
  }
  useEffect(load, []);

  async function updateStatus(id, status) {
    await api.patch(`/reservations/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Reservations</h1>
      <div className="bg-white rounded-xl border border-navy/10 divide-y">
        {reservations.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-5 py-3">
            <div>
              <div className="font-medium">{r.full_name} - party of {r.party_size}</div>
              <div className="text-sm text-navy/60">{r.reservation_date} at {r.reservation_time} - {r.phone}</div>
            </div>
            <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="border border-navy/20 rounded-lg px-2 py-1 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {reservations.length === 0 && <p className="px-5 py-4 text-navy/50">No reservations found.</p>}
      </div>
    </div>
  );
}
