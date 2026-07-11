import { useEffect, useState } from 'react';
import api from '../services/api';
import { useI18n } from '../context/I18nContext';
import { CalendarCheck } from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

const STATUS_BADGE = {
  pending: 'badge-warning',
  confirmed: 'badge-forest',
  completed: 'badge-success',
  cancelled: 'badge-danger',
};

export default function Reservations() {
  const { t } = useI18n();
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
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('reservations_title')}</h1>
          <p className="page-subtitle">{reservations.length} {t('reservations_sub_count')}</p>
        </div>
      </div>
      <div className="card overflow-hidden">
        {reservations.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-line last:border-b-0 hover:bg-surface/60 transition flex-wrap">
            <div>
              <div className="text-sm font-medium text-ink flex items-center gap-2">
                {r.full_name} · {t('party_of')} {r.party_size}
                <span className={STATUS_BADGE[r.status] || 'badge-neutral'}>{t(`status_${r.status}`) || r.status}</span>
              </div>
              <div className="text-sm text-muted mt-1">{r.reservation_date} at {r.reservation_time} · {r.phone}</div>
            </div>
            <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="field py-1.5 w-auto text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {reservations.length === 0 && (
          <div className="empty-state">
            <CalendarCheck size={28} className="mb-2 opacity-50" />
            <p className="text-sm">{t('no_reservations_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
